/**
 * TICKET CONTROLLER - AgriAssistify.ai
 * Enhanced with Detailed Logging + Gemini AI Integration
 */

import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";
import { sendTicketCreatedEmail, sendExpertAssignmentEmail } from "../utilities/mailer.js";
import analyzeTicket from "../utilities/ticketAnalyzer.js";

/**
 * @route   POST /api/tickets
 * @desc    Create new ticket with automatic AI analysis
 * @access  Private
 */
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
            title: title?.substring(0, 50) + '...',
            issueType,
            urgencyLevel,
            reportedBy: req.user._id,
            reporterEmail: req.user.email
        });

        // Validation
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

        // Create ticket with 'analyzing' status for AI processing
        const ticket = await Ticket.create({
            title: title.trim(),
            description: description.trim(),
            issueType,
            urgencyLevel: urgencyLevel || 'medium',
            fieldLocation: fieldLocation?.trim(),
            affectedCrop: affectedCrop?.trim(),
            estimatedImpact: estimatedImpact?.trim(),
            reportedBy,
            status: 'analyzing', // AI will update this
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ticket.populate('reportedBy', 'name email role');

        console.log("✅ Ticket created:", ticket._id);
        console.log("   Title:", ticket.title.substring(0, 50) + '...');
        console.log("   Type:", ticket.issueType);
        console.log("   Status:", ticket.status);

        // Send confirmation email (non-blocking)
        try {
            await sendTicketCreatedEmail(req.user, ticket);
            console.log(`📧 Ticket creation email sent to ${req.user.email}`);
        } catch (emailError) {
            console.error("❌ Email failed:", emailError.message);
        }

        // Trigger Inngest background job (non-blocking)
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
            console.log("🔔 Inngest event queued for ticket:", ticket._id);
        } catch (inngestError) {
            console.log("⚠️ Inngest error (non-critical):", inngestError.message);
        }

        // Start direct AI analysis in background
        generateAISolutionBackground(ticket._id);

        res.status(201).json({
            success: true,
            message: "Farm issue reported successfully! AI is analyzing your issue.",
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

/**
 * Background AI solution generator with detailed logging
 * Runs async without blocking the response
 */
async function generateAISolutionBackground(ticketId) {
    try {
        console.log('🤖 Starting background AI analysis for ticket:', ticketId);

        // Wait a moment to ensure ticket is fully saved
        await new Promise(resolve => setTimeout(resolve, 1000));

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.error('❌ Ticket not found:', ticketId);
            return;
        }

        console.log('📄 Ticket loaded for AI analysis');
        console.log('   Title:', ticket.title.substring(0, 50) + '...');
        console.log('   Description length:', ticket.description.length, 'chars');

        // Generate AI solution
        const aiResult = await analyzeTicket(ticket);

        if (aiResult && aiResult.solution) {
            console.log('✅ AI analysis completed successfully');
            console.log('   Confidence:', aiResult.confidence || 'N/A');
            console.log('   Recommendations:', aiResult.recommendations?.length || 0);
            
            // Save AI solution using the model method
            await ticket.setAISolution(aiResult);
            console.log('✅ AI solution saved for ticket:', ticketId);
            
            // Log final status
            const updatedTicket = await Ticket.findById(ticketId);
            console.log('   Final status:', updatedTicket.status);
            console.log('   AI generated:', updatedTicket.aiSolution?.isGenerated || false);
        } else {
            console.error('❌ AI analysis failed for ticket:', ticketId);
            console.log('   Updating ticket status to "open"');
            
            // Update status to open even if AI fails
            ticket.status = 'open';
            await ticket.save();
            
            console.log('⚠️ Ticket opened without AI solution');
        }

    } catch (error) {
        console.error('❌ Background AI generation error:');
        console.error('   Ticket ID:', ticketId);
        console.error('   Error Type:', error.name);
        console.error('   Error Message:', error.message);
        console.error('   Stack:', error.stack?.substring(0, 200));
        
        // Ensure ticket doesn't stay in 'analyzing' state
        try {
            await Ticket.findByIdAndUpdate(ticketId, { status: 'open' });
            console.log('⚠️ Ticket status updated to "open" after AI failure');
        } catch (updateError) {
            console.error('❌ Failed to update ticket status:', updateError.message);
        }
    }
}

/**
 * @route   GET /api/tickets
 * @desc    Get all tickets with filters
 * @access  Private
 */
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
        
        // Role-based filtering
        if (req.user.role === 'farmer') {
            filter.reportedBy = req.user._id;
            console.log("   Filtering: farmer's own tickets");
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
            console.log("   Filtering: assigned + matching skills");
        }

        // Apply filters
        if (status) {
            filter.status = status;
            console.log("   Filter: status =", status);
        }
        if (issueType) {
            filter.issueType = issueType;
            console.log("   Filter: issueType =", issueType);
        }
        if (urgencyLevel) {
            filter.urgencyLevel = urgencyLevel;
            console.log("   Filter: urgencyLevel =", urgencyLevel);
        }

        // Search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { affectedCrop: { $regex: search, $options: 'i' } }
            ];
            console.log("   Search term:", search);
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

        console.log(`✅ Found ${tickets.length} tickets (page ${page}/${totalPages}, total: ${totalTickets})`);

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

/**
 * @route   GET /api/tickets/:id
 * @desc    Get single ticket with AI solution
 * @access  Private
 */
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
            console.log("❌ Ticket not found:", id);
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        console.log("✅ Ticket found");
        console.log("   Status:", ticket.status);
        console.log("   AI Generated:", ticket.aiSolution?.isGenerated || false);

        // Authorization check
        const isReporter = ticket.reportedBy._id.toString() === req.user._id.toString();
        const isAssignee = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isReporter && !isAssignee && !isModerator) {
            console.log("❌ Unauthorized access attempt by:", req.user._id);
            return res.status(403).json({
                success: false,
                error: "Not authorized to view this ticket"
            });
        }

        // Track last viewed by assignee
        if (isAssignee) {
            await Ticket.findByIdAndUpdate(id, { 
                lastViewedByAssignee: new Date() 
            });
            console.log("📝 Updated last viewed timestamp");
        }

        // Check if AI is still analyzing
        if (ticket.status === 'analyzing' && !ticket.aiSolution?.isGenerated) {
            console.log("⏳ AI still analyzing ticket");
            return res.json({
                success: true,
                ticket,
                message: 'AI is still analyzing your issue. Please refresh in a moment.'
            });
        }

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

/**
 * @route   GET /api/tickets/my-tickets
 * @desc    Get tickets created by current user
 * @access  Private
 */
const getMyTickets = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        console.log("👤 Fetching tickets for user:", userId);

        let filter = { reportedBy: userId };
        if (status) {
            filter.status = status;
            console.log("   Filter: status =", status);
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

/**
 * @route   PUT /api/tickets/:id
 * @desc    Update ticket
 * @access  Private
 */
const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;

        console.log("✏️ Updating ticket:", id);
        console.log("   Updates:", Object.keys(updates));

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found"
            });
        }

        // Authorization
        const isOwner = ticket.reportedBy.toString() === req.user._id.toString();
        const isAssignee = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isOwner && !isAssignee && !isModerator) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to update this ticket"
            });
        }

        // Farmers can only update open tickets
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
            console.log("   Allowed updates for farmer:", Object.keys(updates));
        }

        updates.updatedAt = new Date();

        // Validation
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

/**
 * @route   POST /api/tickets/:id/assign
 * @desc    Assign ticket to worker
 * @access  Private (Moderator/Admin only)
 */
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

        console.log("   Worker found:", worker.name, "Skills:", worker.skills || []);

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

        // Send assignment email
        try {
            await sendExpertAssignmentEmail(worker, updatedTicket, ticket.reportedBy);
            console.log(`📧 Assignment email sent to ${worker.email}`);
        } catch (emailError) {
            console.error("❌ Assignment email failed:", emailError.message);
        }

        console.log("✅ Ticket assigned successfully");

        res.status(200).json({
            success: true,
            message: "Ticket assigned successfully",
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

/**
 * @route   POST /api/tickets/:id/comment
 * @desc    Add comment to ticket
 * @access  Private
 */
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

/**
 * @route   POST /api/tickets/:id/resolve
 * @desc    Resolve ticket
 * @access  Private
 */
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
        console.log("   Resolved by:", req.user.name);

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

/**
 * @route   POST /api/tickets/:id/close
 * @desc    Close ticket
 * @access  Private
 */
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

/**
 * @route   DELETE /api/tickets/:id
 * @desc    Delete ticket
 * @access  Private (Moderator/Admin only)
 */
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

/**
 * @route   GET /api/tickets/stats
 * @desc    Get ticket statistics
 * @access  Private
 */
const getStats = async (req, res) => {
    try {
        console.log("📊 Fetching ticket statistics");

        const [
            totalTickets,
            openTickets,
            analyzingTickets,
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
            Ticket.countDocuments({ status: 'analyzing' }),
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

        console.log("✅ Statistics compiled");
        console.log("   Total:", totalTickets);
        console.log("   Analyzing:", analyzingTickets);
        console.log("   Open:", openTickets);
        console.log("   In Progress:", inProgressTickets);
        console.log("   Resolved:", resolvedTickets);

        res.status(200).json({
            success: true,
            stats: {
                overview: {
                    total: totalTickets,
                    open: openTickets,
                    analyzing: analyzingTickets,
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

/**
 * @route   POST /api/tickets/:id/regenerate-ai
 * @desc    Regenerate AI solution for ticket
 * @access  Private
 */
const regenerateAISolution = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🔄 Regenerating AI solution for ticket:', id);

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }

        // Authorization check
        const isReporter = ticket.reportedBy.toString() === req.user._id.toString();
        const isModerator = ['moderator', 'admin'].includes(req.user.role);

        if (!isReporter && !isModerator) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to regenerate AI solution for this ticket'
            });
        }

        console.log('   Setting ticket to analyzing status...');

        // Set status to analyzing
        ticket.status = 'analyzing';
        ticket.aiSolution = {
            isGenerated: false
        };
        await ticket.save();

        console.log('   Calling AI analyzer...');

        // Generate new AI solution
        const aiResult = await analyzeTicket(ticket);

        if (aiResult && aiResult.solution) {
            console.log('   AI analysis successful, saving...');
            await ticket.setAISolution(aiResult);
            
            const updatedTicket = await Ticket.findById(id)
                .populate('reportedBy', 'name email role')
                .populate('assignedTo', 'name email role skills');

            console.log('✅ AI solution regenerated successfully');
            console.log('   Confidence:', aiResult.confidence || 'N/A');

            res.json({
                success: true,
                message: 'AI solution regenerated successfully',
                ticket: updatedTicket
            });
        } else {
            console.error('❌ AI regeneration failed');
            ticket.status = 'open';
            await ticket.save();

            res.status(500).json({
                success: false,
                error: 'Failed to regenerate AI solution'
            });
        }

    } catch (error) {
        console.error('❌ Regenerate AI solution error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to regenerate AI solution',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Export all controller functions
 */
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
    getMyTickets,
    regenerateAISolution
};
