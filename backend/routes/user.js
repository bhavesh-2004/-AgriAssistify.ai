/**
 * AUTH/USER ROUTES - AgriAssistify.ai
 * 
 * Handles user authentication and profile management
 * Routes:
 * - POST /signup - Create new user account
 * - POST /login - User authentication
 * - POST /logout - Logout (client-side token removal)
 * - PUT /update-profile - Update user profile (authenticated)
 * - POST /update-user - Admin-only user management
 * - GET /users - Get all users (admin only)
 */

import express from "express";
import { 
    getUsers, 
    login, 
    logout, 
    signup, 
    updateProfile,  // ✅ Add this import
    updateUser 
} from "../controllers/user.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post("/signup", signup);
router.post("/login", login);

// ==================== PROTECTED ROUTES ====================
// Any authenticated user can logout
router.post("/logout", authenticate, logout);

// Any authenticated user can update their own profile
router.put("/update-profile", authenticate, updateProfile);  // ✅ Add this route

// ==================== ADMIN-ONLY ROUTES ====================
// Admin can update any user
router.post("/update-user", authenticate, authorize(['admin']), updateUser);

// Admin can view all users
router.get("/users", authenticate, authorize(['admin']), getUsers);

export default router;
