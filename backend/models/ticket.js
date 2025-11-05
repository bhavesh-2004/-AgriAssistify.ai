/**
 * TICKET MODEL - AgriAssistify.ai
 * 
 * Mongoose schema for farm issue tickets
 * Structures farm issues (pest attacks, irrigation needs, equipment problems, etc.)
 * with comprehensive status tracking and assignment workflow
 * 
 * Features:
 * - Issue classification and prioritization
 * - User assignment and tracking
 * - Comments and collaboration
 * - AI-powered suggestions
 * - Attachment support
 * - Resolution tracking
 */

import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        // ==================== BASIC INFORMATION ====================
        title: {
            type: String,
            required: [true, "Issue title is required"],
            trim: true,
            minlength: [5, "Title must be at least 5 characters long"],
            maxlength: [200, "Title cannot exceed 200 characters"]
        },

        description: {
            type: String,
            required: [true, "Issue description is required"],
            trim: true,
            minlength: [20, "Description must be at least 20 characters for AI analysis"],
            maxlength: [2000, "Description cannot exceed 2000 characters"]
        },

        // ==================== CLASSIFICATION ====================
        issueType: {
            type: String,
            required: [true, "Issue type is required"],
            enum: {
                values: [
                    'pest-attack',      // 🐛 Pest infestations
                    'irrigation',       // 💧 Water and irrigation issues
                    'equipment',        // 🔧 Machinery and tool problems
                    'disease',          // 🦠 Plant diseases
                    'harvest',          // 🌾 Harvest-related issues
                    'other'             // 📋 Other agricultural concerns
                ],
                message: '{VALUE} is not a valid issue type'
            }
        },

        urgencyLevel: {
            type: String,
            required: [true, "Urgency level is required"],
            enum: {
                values: ['low', 'medium', 'high'],
                message: '{VALUE} is not a valid urgency level'
            },
            default: 'medium'
        },

        priority: {
            type: String,
            enum: {
                values: ['low', 'medium', 'high', 'critical'],
                message: '{VALUE} is not a valid priority level'
            },
            default: 'medium'
        },

        status: {
            type: String,
            enum: {
                values: [
                    'open',         // Newly created, awaiting assignment
                    'in-progress',  // Being worked on by assigned worker
                    'resolved',     // Solution provided, awaiting confirmation
                    'closed'        // Confirmed resolved and closed
                ],
                message: '{VALUE} is not a valid status'
            },
            default: 'open'
        },

        // ==================== FARM & LOCATION DETAILS ====================
        fieldLocation: {
            type: String,
            trim: true,
            maxlength: [100, "Field location cannot exceed 100 characters"]
        },

        affectedCrop: {
            type: String,
            trim: true,
            maxlength: [100, "Affected crop cannot exceed 100 characters"]
        },

        estimatedImpact: {
            type: String,
            trim: true,
            maxlength: [500, "Estimated impact cannot exceed 500 characters"]
        },

        // ==================== USER REFERENCES ====================
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Reporter user ID is required"],
            index: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },

        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm'
            // Optional - not all users may have farm documents
        },

        // ==================== SKILL & AI FEATURES ====================
        requiredSkills: {
            type: [String],
            default: [],
            validate: {
                validator: function(skills) {
                    return skills.length <= 10;
                },
                message: 'Cannot have more than 10 required skills'
            }
        },

        aiSuggestions: {
            type: String,
            trim: true,
            maxlength: [1000, "AI suggestions cannot exceed 1000 characters"]
        },

        // ==================== ATTACHMENTS ====================
        attachments: [{
            filename: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],

        // ==================== COMMENTS & COLLABORATION ====================
        comments: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true,
                trim: true,
                maxlength: [500, "Comment cannot exceed 500 characters"]
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],

        // ==================== RESOLUTION DETAILS ====================
        resolution: {
            type: String,
            trim: true,
            maxlength: [1000, "Resolution cannot exceed 1000 characters"]
        },

        resolvedAt: {
            type: Date
        },

        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true  // Automatically adds createdAt and updatedAt fields
    }
);

// ==================== INDEXES FOR PERFORMANCE ====================
// Composite index for common queries
ticketSchema.index({ reportedBy: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ issueType: 1, urgencyLevel: 1 });
ticketSchema.index({ createdAt: -1 });

// Text index for search functionality
ticketSchema.index({ 
    title: 'text', 
    description: 'text' 
});

// ==================== VIRTUAL PROPERTIES ====================
// Calculate time elapsed since creation
ticketSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Days
});

// Check if ticket is overdue (open for more than 7 days)
ticketSchema.virtual('isOverdue').get(function() {
    if (this.status === 'closed' || this.status === 'resolved') return false;
    const daysSinceCreation = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
    return daysSinceCreation > 7;
});

// ==================== INSTANCE METHODS ====================
// Add comment to ticket
ticketSchema.methods.addComment = function(userId, text) {
    this.comments.push({
        user: userId,
        text: text,
        createdAt: new Date()
    });
    return this.save();
};

// Assign ticket to worker
ticketSchema.methods.assignTo = function(workerId) {
    this.assignedTo = workerId;
    this.status = 'in-progress';
    return this.save();
};

// Resolve ticket
ticketSchema.methods.resolve = function(userId, resolutionText) {
    this.status = 'resolved';
    this.resolution = resolutionText;
    this.resolvedBy = userId;
    this.resolvedAt = new Date();
    return this.save();
};

// Close ticket
ticketSchema.methods.close = function() {
    this.status = 'closed';
    return this.save();
};

// ==================== STATIC METHODS ====================
// Find tickets by status
ticketSchema.statics.findByStatus = function(status) {
    return this.find({ status })
        .populate('reportedBy', 'name email role')
        .populate('assignedTo', 'name email role skills')
        .sort({ createdAt: -1 });
};

// Find urgent tickets
ticketSchema.statics.findUrgent = function() {
    return this.find({ 
        urgencyLevel: 'high',
        status: { $in: ['open', 'in-progress'] }
    })
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 });
};

// Get statistics
ticketSchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    return stats;
};

// ==================== PRE-SAVE MIDDLEWARE ====================
// Auto-update priority based on urgency and age
ticketSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('urgencyLevel')) {
        if (this.urgencyLevel === 'high') {
            this.priority = 'high';
        } else if (this.urgencyLevel === 'medium') {
            this.priority = 'medium';
        } else {
            this.priority = 'low';
        }
    }
    next();
});

// ==================== EXPORT MODEL ====================
const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
