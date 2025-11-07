/**
 * TICKET MODEL - AgriAssistify.ai (Enhanced with AI Integration)
 * 
 * Features:
 * - AI-powered solution generation with Gemini 2.5 Flash
 * - Comprehensive issue tracking
 * - Status management and workflow
 * - Comments and collaboration
 * - Attachment support
 * 
 * UPDATED: Increased character limits for detailed AI responses
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
                    'open',           // Newly created, awaiting assignment
                    'analyzing',      // AI is analyzing the issue
                    'in-progress',    // Being worked on by assigned worker
                    'resolved',       // Solution provided, awaiting confirmation
                    'closed'          // Confirmed resolved and closed
                ],
                message: '{VALUE} is not a valid status'
            },
            default: 'analyzing'  // Changed to analyzing for AI integration
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
        },

        // ==================== AI SOLUTION FIELD (ENHANCED FOR GEMINI 2.5 FLASH) ====================
        aiSolution: {
            isGenerated: {
                type: Boolean,
                default: false
            },
            generatedAt: {
                type: Date
            },
            summary: {
                type: String,
                trim: true,
                maxlength: [500, "Summary cannot exceed 500 characters"]  // ✅ Kept at 500
            },
            solution: {
                type: String,
                trim: true,
                maxlength: [5000, "Solution cannot exceed 5000 characters"]  // ✅ INCREASED from 2000 to 5000
            },
            recommendations: [{
                type: String,
                trim: true,
                maxlength: [500, "Recommendation cannot exceed 500 characters"]  // ✅ Kept at 500 (detailed steps)
            }],
            possibleCauses: [{
                type: String,
                trim: true,
                maxlength: [400, "Cause cannot exceed 400 characters"]  // ✅ INCREASED from 300 to 400
            }],
            preventionTips: [{
                type: String,
                trim: true,
                maxlength: [500, "Prevention tip cannot exceed 500 characters"]  // ✅ INCREASED from 300 to 500
            }],
            urgencyAssessment: {
                type: String,
                enum: ['low', 'medium', 'high', 'critical'],
                default: 'medium'
            },
            estimatedResolutionTime: {
                type: String,
                trim: true,
                maxlength: [100, "Resolution time estimate cannot exceed 100 characters"]  // ✅ Kept at 100
            },
            confidence: {
                type: Number,
                min: 0,
                max: 100,
                default: 75
            },
            relatedSkills: [{
                type: String,
                trim: true
            }],
            helpfulNotes: {
                type: String,
                trim: true,
                maxlength: [2000, "Helpful notes cannot exceed 2000 characters"]  // ✅ INCREASED from 1000 to 2000
            }
        },

        // ==================== SKILL & AI FEATURES (LEGACY) ====================
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
        timestamps: true
    }
);

// ==================== INDEXES FOR PERFORMANCE ====================
ticketSchema.index({ reportedBy: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ issueType: 1, urgencyLevel: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ 'aiSolution.isGenerated': 1 });

// Text index for search functionality
ticketSchema.index({ 
    title: 'text', 
    description: 'text' 
});

// ==================== VIRTUAL PROPERTIES ====================
ticketSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

ticketSchema.virtual('isOverdue').get(function() {
    if (this.status === 'closed' || this.status === 'resolved') return false;
    const daysSinceCreation = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
    return daysSinceCreation > 7;
});

// Check if AI solution is ready
ticketSchema.virtual('hasAISolution').get(function() {
    return this.aiSolution && this.aiSolution.isGenerated === true;
});

// ==================== INSTANCE METHODS ====================
ticketSchema.methods.addComment = function(userId, text) {
    this.comments.push({
        user: userId,
        text: text,
        createdAt: new Date()
    });
    return this.save();
};

ticketSchema.methods.assignTo = function(workerId) {
    this.assignedTo = workerId;
    this.status = 'in-progress';
    return this.save();
};

ticketSchema.methods.resolve = function(userId, resolutionText) {
    this.status = 'resolved';
    this.resolution = resolutionText;
    this.resolvedBy = userId;
    this.resolvedAt = new Date();
    return this.save();
};

ticketSchema.methods.close = function() {
    this.status = 'closed';
    return this.save();
};

// New method: Set AI solution (Enhanced for Gemini 2.5 Flash)
ticketSchema.methods.setAISolution = function(aiData) {
    this.aiSolution = {
        isGenerated: true,
        generatedAt: new Date(),
        summary: aiData.summary || '',
        solution: aiData.solution || aiData.helpfulNotes || '',
        recommendations: aiData.recommendations || [],
        possibleCauses: aiData.possibleCauses || [],
        preventionTips: aiData.preventionTips || [],
        urgencyAssessment: aiData.urgencyAssessment || aiData.priority || 'medium',
        estimatedResolutionTime: aiData.estimatedResolutionTime || 'To be determined',
        confidence: aiData.confidence || 75,
        relatedSkills: aiData.relatedSkills || [],
        helpfulNotes: aiData.helpfulNotes || ''
    };
    
    // Update required skills from AI
    if (aiData.relatedSkills && aiData.relatedSkills.length > 0) {
        this.requiredSkills = aiData.relatedSkills;
    }
    
    // Update status to open after AI analysis
    if (this.status === 'analyzing') {
        this.status = 'open';
    }
    
    return this.save();
};

// ==================== STATIC METHODS ====================
ticketSchema.statics.findByStatus = function(status) {
    return this.find({ status })
        .populate('reportedBy', 'name email role')
        .populate('assignedTo', 'name email role skills')
        .sort({ createdAt: -1 });
};

ticketSchema.statics.findUrgent = function() {
    return this.find({ 
        urgencyLevel: 'high',
        status: { $in: ['open', 'in-progress'] }
    })
        .populate('reportedBy', 'name email')
        .sort({ createdAt: -1 });
};

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

// Get tickets pending AI analysis
ticketSchema.statics.findPendingAI = function() {
    return this.find({ 
        status: 'analyzing',
        'aiSolution.isGenerated': false
    }).sort({ createdAt: 1 });
};

// ==================== PRE-SAVE MIDDLEWARE ====================
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
