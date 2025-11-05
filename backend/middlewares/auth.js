/**
 * AUTH.JS - AgriAssistify.ai Authentication Middleware
 * JWT-based authentication without Redis dependency
 * Provides authentication and role-based authorization
 */

import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                error: "Access denied. No token provided." 
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "agriassistify-fallback-secret");

        // Enhanced user data with validation
        req.user = {
            _id: decoded._id,
            role: decoded.role,
            name: decoded.name,
            email: decoded.email
        };

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: "Token expired. Please login again." 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                error: "Invalid token. Access denied." 
            });
        }

        return res.status(500).json({ 
            success: false,
            error: "Authentication failed"
        });
    }
};

// Enhanced authorization with multiple roles support
export const authorize = (roles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    success: false,
                    error: "Authentication required" 
                });
            }

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false,
                    error: `Access denied. Required role: ${roles.join(' or ')}`,
                    currentRole: req.user.role
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({
                success: false,
                error: "Authorization failed"
            });
        }
    };
};

// Role hierarchy check
const hasPermission = (userRole, requiredRoles) => {
    const roleHierarchy = {
        'admin': 4,
        'moderator': 3,
        'worker': 2,
        'farmer': 1
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = Math.min(...requiredRoles.map(role => roleHierarchy[role] || 5));
    
    return userLevel >= requiredLevel;
};

// Specific role middlewares
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: "Admin access required"
        });
    }
    next();
};

export const isModerator = (req, res, next) => {
    if (!['moderator', 'admin'].includes(req.user?.role)) {
        return res.status(403).json({
            success: false,
            error: "Moderator access required"
        });
    }
    next();
};

export const isWorker = (req, res, next) => {
    if (!hasPermission(req.user?.role, ['worker'])) {
        return res.status(403).json({
            success: false,
            error: "Worker access required"
        });
    }
    next();
};

export const isFarmer = (req, res, next) => {
    if (!hasPermission(req.user?.role, ['farmer'])) {
        return res.status(403).json({
            success: false,
            error: "User access required"
        });
    }
    next();
};

// Enhanced middleware with user data validation
export const authenticateWithUser = async (req, res, next) => {
    try {
        await authenticate(req, res, async () => {
            try {
                const user = await User.findById(req.user._id).select('-password');
                
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        error: "User not found. Please login again."
                    });
                }

                req.user = {
                    ...req.user,
                    ...user.toObject()
                };

                next();
            } catch (error) {
                console.error("User validation error:", error);
                return res.status(500).json({
                    success: false,
                    error: "User validation failed"
                });
            }
        });
    } catch (error) {
        // Error already handled by authenticate middleware
    }
};

// Optional authentication (for public routes with optional user data)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "agriassistify-fallback-secret");
            
            req.user = {
                _id: decoded._id,
                role: decoded.role,
                name: decoded.name,
                email: decoded.email
            };
        }
        
        next();
    } catch (error) {
        // Ignore auth errors for optional auth
        next();
    }
};

// Rate limiting per user
export const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const requests = new Map();

    return (req, res, next) => {
        if (!req.user) {
            return next();
        }

        const userId = req.user._id.toString();
        const now = Date.now();
        const userRequests = requests.get(userId) || [];

        // Clean old requests
        const recentRequests = userRequests.filter(time => now - time < windowMs);

        if (recentRequests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: "Too many requests. Please try again later.",
                retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
            });
        }

        recentRequests.push(now);
        requests.set(userId, recentRequests);

        next();
    };
};

// Check if user owns resource
export const checkOwnership = (resourceField = 'reportedBy') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Authentication required"
            });
        }

        if (['moderator', 'admin'].includes(req.user.role)) {
            return next();
        }

        const resource = req.body || req.query || {};
        const resourceOwnerId = resource[resourceField];

        if (!resourceOwnerId || resourceOwnerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: "Access denied. You can only access your own resources."
            });
        }

        next();
    };
};

export {
    authenticate as default,
    hasPermission
};
