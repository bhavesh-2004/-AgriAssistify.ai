import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";
import { sendTicketCreatedEmail, sendExpertAssignmentEmail } from "../utilities/mailer.js";

const createTicket = async (req, res) => {
    try {
        const {
            title,
            description,
            issueType,
            urgencyLevel,
            fieldLocation,
            affectedCrop,
            estimatedImpact
        } = req.body;

        console.log("📝 Creating ticket:", {
            title,
            issueType,
            urgencyLevel,
            reportedBy: req.user._id
        });

        if (!title || !description || !issueType) {
            return res.status(400).json({
                success: false,
                error: "Title, description, and issue type are required"
            });
        }

        if (title.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: "Title must be at least 10 characters long"
            });
        }

        if (description.trim().length < 20) {
            return res.status(400).json({
                success: false,
                error: "Description must be at least 20 characters for proper AI analysis"
            });
        }

        const validIssueTypes = ['pest-attack', 'irrigation', 'equipment', 'disease', 'harvest', 'other'];
        if (!validIssueTypes.includes(issueType)) {
            return res.status(400).json({
                success: false,
                error: "Invalid issue type"
            });
        }

        const validUrgencyLevels = ['low', 'medium', 'high'];
        if (urgencyLevel && !validUrgencyLevels.includes(urgencyLevel)) {
            return res.status(400).json({
                success: false,
                error: "Invalid urgency level"
            });
        }

        const reportedBy = req.user._id;

        const ticket = await Ticket.create({
            title: title.trim(),
            description: description.trim(),
            issueType,
            urgencyLevel: urgencyLevel || 'medium',
            fieldLocation: fieldLocation?.trim(),
            affectedCrop: affectedCrop?.trim(),
            estimatedImpact: estimatedImpact?.trim(),
            reportedBy,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ticket.populate('reportedBy', 'name email role');

        console.log("✅ Ticket created successfully:", ticket._id);

        try {
            await sendTicketCreatedEmail(req.user, ticket);
            console.log(`✅ Ticket creation email sent to ${req.user.email}`);
        } catch (emailError) {
            console.error("❌ Ticket creation email failed:", emailError.message);
        }

        try {
            await inngest.send({
                name: "ticket/created",
                data: {
                    ticketId: ticket._id.toString(),
                    title: ticket.title,
                    description: ticket.description,
                    issueType: ticket.issueType,
                    urgencyLevel: ticket.urgencyLevel,
                    reportedBy: reportedBy.toString(),
                    userEmail: req.user.email
                }
            });
            console.log("🤖 AI analysis queued for ticket:", ticket._id);
        } catch (inngestError) {
            console.log("⚠️ Inngest error (non-critical):", inngestError.message);
        }

        res.status(201).json({
            success: true,
            message: "Farm issue reported successfully! Confirmation email sent.",
            ticket
        });

    } catch (error) {
        console.error("❌ Create ticket error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            error: "Failed to create ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const getTickets = async (req, res) => {
    try {
        const { 
            status, 
            issueType, 
            urgencyLevel, 
            search, 
            page = 1, 
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        console.log("📋 Fetching tickets for user:", req.user._id, "role:", req.user.role);

        let filter = {};
        
        if (req.user.role === 'farmer') {
            filter.reportedBy = req.user._id;
        }
        
        if (req.user.role === 'worker') {
            const user = await User.findById(req.user._id);
            filter.$or = [
                { assignedTo: req.user._id },
                { 
                    status: 'open', 
                    assignedTo: null,
                    ...(user.skills && user.skills.length > 0 && {
                        issueType: { $in: user.skills }
                    })
                }
            ];
        }

        if (status) filter.status = status;
        if (issueType) filter.issueType = issueType;
        if (urgencyLevel) filter.urgencyLevel = urgencyLevel;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { affectedCrop: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const tickets = await Ticket.find(filter)
            .populate('reportedBy', 'name email role')
            .populate('assignedTo', 'name email role skills')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const totalTickets = await Ticket.countDocuments(filter);
        const totalPages = Math.ceil(totalTickets / parseInt(limit));

        console.log(`✅ Found ${tickets.length} tickets (${totalTickets} total)`);

        res.status(200).json({
            success: true,
            tickets,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalTickets,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error("❌ Get tickets error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch tickets",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const getTicket = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("🔍 Fetching ticket:", id);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                error: "Invalid ticket ID format"
            });
        }

        const ticket = await Ticket.findById(id)
            .populate('reportedBy', 'name email role location phone')
            .populate('assignedTo', 'name email role skills location phone')
            .populate('comments.user', 'name email role')
            .populate('resolvedBy', 'name email role');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        const isReporter = ticket.reportedBy._id.toString() === req.user._id.toString();
        const isAssignee = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isReporter && !isAssignee && !isModerator) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to view this ticket"
            });
        }

        if (isAssignee) {
            await Ticket.findByIdAndUpdate(id, { 
                lastViewedByAssignee: new Date() 
            });
        }

        console.log("✅ Ticket fetched successfully");

        res.status(200).json({
            success: true,
            ticket
        });

    } catch (error) {
        console.error("❌ Get ticket error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;

        console.log("✏️ Updating ticket:", id, "Updates:", updates);

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        const isOwner = ticket.reportedBy.toString() === req.user._id.toString();
        const isAssignee = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isOwner && !isAssignee && !isModerator) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to update this ticket"
            });
        }

        if (req.user.role === 'farmer') {
            if (ticket.status !== 'open') {
                return res.status(403).json({
                    success: false,
                    error: "Cannot modify ticket once it's been processed"
                });
            }
            
            const allowedUpdates = ['title', 'description', 'fieldLocation', 'affectedCrop', 'estimatedImpact'];
            const filteredUpdates = {};
            
            Object.keys(updates).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    filteredUpdates[key] = updates[key];
                }
            });
            
            updates = filteredUpdates;
        }

        updates.updatedAt = new Date();

        if (updates.title && updates.title.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: "Title must be at least 10 characters long"
            });
        }

        if (updates.description && updates.description.trim().length < 20) {
            return res.status(400).json({
                success: false,
                error: "Description must be at least 20 characters long"
            });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate('reportedBy', 'name email role')
            .populate('assignedTo', 'name email role skills');

        console.log("✅ Ticket updated successfully");

        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });

    } catch (error) {
        console.error("❌ Update ticket error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const assignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { workerId } = req.body;

        console.log("👷 Assigning ticket:", id, "to worker:", workerId);

        if (!['moderator', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "Only moderators and admins can assign tickets"
            });
        }

        if (!workerId) {
            return res.status(400).json({
                success: false,
                error: "Worker ID is required"
            });
        }

        const worker = await User.findById(workerId);
        if (!worker) {
            return res.status(404).json({
                success: false,
                error: "Worker not found"
            });
        }

        if (worker.role !== 'worker') {
            return res.status(400).json({
                success: false,
                error: "Selected user is not a worker"
            });
        }

        const ticket = await Ticket.findById(id)
            .populate('reportedBy', 'name email role');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { 
                assignedTo: workerId,
                status: 'in-progress',
                assignedAt: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        )
            .populate('reportedBy', 'name email role')
            .populate('assignedTo', 'name email role skills');

        try {
            await sendExpertAssignmentEmail(worker, updatedTicket, ticket.reportedBy);
            console.log(`✅ Assignment email sent to expert ${worker.email}`);
        } catch (emailError) {
            console.error("❌ Assignment email failed:", emailError.message);
        }

        console.log("✅ Ticket assigned successfully");

        res.status(200).json({
            success: true,
            message: "Ticket assigned successfully and expert notified via email",
            ticket: updatedTicket
        });

    } catch (error) {
        console.error("❌ Assign ticket error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to assign ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, isPrivate = false } = req.body;

        console.log("💬 Adding comment to ticket:", id);

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Comment text is required"
            });
        }

        if (text.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                error: "Comment must be less than 1000 characters"
            });
        }

        const ticket = await Ticket.findById(id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        const isReporter = ticket.reportedBy._id.toString() === req.user._id.toString();
        const isAssignee = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isReporter && !isAssignee && !isModerator) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to comment on this ticket"
            });
        }

        const comment = {
            user: req.user._id,
            text: text.trim(),
            isPrivate: isPrivate && ['moderator', 'admin'].includes(req.user.role),
            createdAt: new Date()
        };

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { 
                $push: { comments: comment },
                $set: { 
                    lastCommentAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { new: true }
        )
            .populate('comments.user', 'name email role')
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email');

        console.log("✅ Comment added successfully");

        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            ticket: updatedTicket
        });

    } catch (error) {
        console.error("❌ Add comment error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to add comment",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        console.log("✅ Resolving ticket:", id);

        if (!resolution || resolution.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Resolution description is required"
            });
        }

        if (resolution.trim().length < 20) {
            return res.status(400).json({
                success: false,
                error: "Resolution must be at least 20 characters long"
            });
        }

        const ticket = await Ticket.findById(id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        const isAssignee = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isAssignee && !isModerator) {
            return res.status(403).json({
                success: false,
                error: "Only assigned worker or moderator can resolve this ticket"
            });
        }

        const resolvedTicket = await Ticket.findByIdAndUpdate(
            id,
            {
                status: 'resolved',
                resolution: resolution.trim(),
                resolvedBy: req.user._id,
                resolvedAt: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        )
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email role')
            .populate('resolvedBy', 'name email role');

        console.log("✅ Ticket resolved successfully");

        res.status(200).json({
            success: true,
            message: "Ticket resolved successfully",
            ticket: resolvedTicket
        });

    } catch (error) {
        console.error("❌ Resolve ticket error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to resolve ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const closeTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;

        console.log("🔒 Closing ticket:", id);

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        const isReporter = ticket.reportedBy.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isReporter && !isModerator) {
            return res.status(403).json({
                success: false,
                error: "Only the farmer who reported or moderator can close this ticket"
            });
        }

        if (ticket.status !== 'resolved') {
            return res.status(400).json({
                success: false,
                error: "Ticket must be resolved before it can be closed"
            });
        }

        const closedTicket = await Ticket.findByIdAndUpdate(
            id,
            {
                status: 'closed',
                ...(feedback && { farmerFeedback: feedback.trim() }),
                closedAt: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        )
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email role')
            .populate('resolvedBy', 'name email role');

        console.log("✅ Ticket closed successfully");

        res.status(200).json({
            success: true,
            message: "Ticket closed successfully",
            ticket: closedTicket
        });

    } catch (error) {
        console.error("❌ Close ticket error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to close ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("🗑️ Deleting ticket:", id);

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        if (!['moderator', 'admin'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "Only moderators and admins can delete tickets"
            });
        }

        await Ticket.findByIdAndDelete(id);

        console.log("✅ Ticket deleted successfully");

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully"
        });

    } catch (error) {
        console.error("❌ Delete ticket error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete ticket",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const getStats = async (req, res) => {
    try {
        console.log("📊 Fetching comprehensive ticket statistics");

        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            urgentTickets,
            ticketsByType,
            recentTickets,
            avgResolutionTime
        ] = await Promise.all([
            Ticket.countDocuments(),
            Ticket.countDocuments({ status: 'open' }),
            Ticket.countDocuments({ status: 'in-progress' }),
            Ticket.countDocuments({ status: 'resolved' }),
            Ticket.countDocuments({ status: 'closed' }),
            Ticket.countDocuments({ 
                urgencyLevel: 'high',
                status: { $in: ['open', 'in-progress'] }
            }),
            Ticket.aggregate([
                { $group: { _id: '$issueType', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            Ticket.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('reportedBy', 'name email')
                .populate('assignedTo', 'name email'),
            Ticket.aggregate([
                { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
                { 
                    $project: { 
                        resolutionTime: { 
                            $subtract: ['$resolvedAt', '$createdAt'] 
                        } 
                    } 
                },
                { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } }
            ])
        ]);

        console.log("✅ Statistics fetched successfully");

        res.status(200).json({
            success: true,
            stats: {
                overview: {
                    total: totalTickets,
                    open: openTickets,
                    inProgress: inProgressTickets,
                    resolved: resolvedTickets,
                    closed: closedTickets,
                    urgent: urgentTickets
                },
                byType: ticketsByType,
                recentTickets,
                performance: {
                    avgResolutionTime: avgResolutionTime[0]?.avgTime || 0,
                    resolutionRate: totalTickets > 0 ? ((resolvedTickets + closedTickets) / totalTickets * 100).toFixed(1) : 0
                }
            }
        });

    } catch (error) {
        console.error("❌ Get stats error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch statistics",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const getMyTickets = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        console.log("👤 Fetching tickets for user:", userId);

        let filter = { reportedBy: userId };
        if (status) {
            filter.status = status;
        }

        const tickets = await Ticket.find(filter)
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${tickets.length} tickets for user`);

        res.status(200).json({
            success: true,
            count: tickets.length,
            tickets
        });

    } catch (error) {
        console.error("❌ Get my tickets error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch your tickets",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

// Single export block - no duplicates
export {
    createTicket,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
    addComment,
    resolveTicket,
    closeTicket,
    getStats,
    getMyTickets
};
