import express from "express";
import rateLimit from "express-rate-limit";
import { 
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
    regenerateAISolution  // NEW: Add this
} from "../controllers/ticket.js";
import { authenticate, authorize } from "../middlewares/auth.js";

// Rate limiting
const createTicketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many tickets created. Please wait before creating another ticket."
    }
});

const commentLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many comments. Please wait before commenting again."
    }
});

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many AI requests. Please wait before regenerating."
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Too many requests. Please try again later."
    }
});

const router = express.Router();
router.use(apiLimiter);

// Main routes
router.get("/", authenticate, getTickets);
router.get("/stats", authenticate, getStats);
router.get("/my-tickets", authenticate, getMyTickets);
router.get("/:id", authenticate, getTicket);
router.post("/", authenticate, createTicketLimiter, createTicket);
router.put("/:id", authenticate, updateTicket);
router.delete("/:id", authenticate, authorize(['moderator', 'admin']), deleteTicket);

// Actions
router.post("/:id/assign", authenticate, authorize(['moderator', 'admin']), assignTicket);
router.post("/:id/comment", authenticate, commentLimiter, addComment);
router.post("/:id/resolve", authenticate, resolveTicket);
router.post("/:id/close", authenticate, closeTicket);

// AI Solution routes (NEW)
router.post("/:id/regenerate-ai", authenticate, aiLimiter, regenerateAISolution);

// Error handling
router.use((error, req, res, next) => {
    console.error('Ticket route error:', error);
    
    if (error.status === 429) {
        return res.status(429).json({
            success: false,
            error: "Too many requests. Please try again later.",
            retryAfter: error.resetTime
        });
    }
    
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: "Validation failed",
            details: Object.values(error.errors).map(err => err.message)
        });
    }
    
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: "Invalid ticket ID format"
        });
    }
    
    res.status(500).json({
        success: false,
        error: "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
});

export default router;
