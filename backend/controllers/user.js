import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";
import { sendWelcomeEmail } from "../utilities/mailer.js";

const signup = async (req, res) => {
    const { name, email, password, role = "farmer", skills = [] } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: "Name, email and password are required" 
            });
        }

        if (name.trim().length < 2) {
            return res.status(400).json({ 
                success: false,
                error: "Name must be at least 2 characters long" 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Please enter a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                error: "User already exists with this email" 
            });
        }

        const hashed = await bcrypt.hash(password, 12);
        
        const user = await User.create({ 
            name: name.trim(),
            email: email.trim().toLowerCase(), 
            password: hashed, 
            role,
            skills 
        });

        try {
            await inngest.send({
                name: "user/signup",
                data: { 
                    userId: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role 
                }
            });
        } catch (inngestError) {
            console.log("Inngest error (non-critical):", inngestError.message);
        }

        try {
            await sendWelcomeEmail(user);
            console.log(`✅ Welcome email sent to ${user.email}`);
        } catch (emailError) {
            console.error("❌ Welcome email failed:", emailError.message);
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET || "agriassistify-fallback-secret-key",
            { expiresIn: "30d" }
        );

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skills: user.skills,
            createdAt: user.createdAt,
            emailVerified: false
        };

        res.status(201).json({ 
            success: true,
            message: "Account created successfully! Welcome email sent.",
            user: userResponse, 
            token 
        });

    } catch (error) {
        console.error("Signup error:", error);
        
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "Email already exists"
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Signup failed", 
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: "Email and password are required" 
            });
        }

        const user = await User.findOne({ 
            email: new RegExp(`^${email.toLowerCase()}$`, 'i')
        });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid email or password" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid email or password" 
            });
        }

        await User.findByIdAndUpdate(user._id, { 
            lastLoginAt: new Date() 
        });

        const token = jwt.sign(
            { 
                _id: user._id, 
                role: user.role, 
                name: user.name,
                email: user.email 
            },
            process.env.JWT_SECRET || "agriassistify-fallback-secret-key",
            { expiresIn: "30d" }
        );

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            skills: user.skills || [],
            phone: user.phone,
            location: user.location,
            bio: user.bio,
            farmSize: user.farmSize,
            cropTypes: user.cropTypes || [],
            yearsExperience: user.yearsExperience,
            createdAt: user.createdAt,
            lastLoginAt: new Date()
        };

        console.log(`✅ User login successful: ${user.email}`);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse,
            token,
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            error: "Login failed",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            name,
            phone,
            location,
            bio,
            skills,
            farmSize,
            cropTypes,
            yearsExperience
        } = req.body;

        console.log("📝 Updating profile for user:", userId);
        console.log("Update data:", req.body);

        if (name && name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: "Name must be at least 2 characters long"
            });
        }

        if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            return res.status(400).json({
                success: false,
                error: "Please enter a valid 10-digit phone number"
            });
        }

        if (yearsExperience && (yearsExperience < 0 || yearsExperience > 80)) {
            return res.status(400).json({
                success: false,
                error: "Years of experience must be between 0 and 80"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(name && { name: name.trim() }),
                ...(phone && { phone: phone.trim() }),
                ...(location && { location: location.trim() }),
                ...(bio && { bio: bio.trim() }),
                ...(skills && { skills }),
                ...(farmSize && { farmSize: farmSize.trim() }),
                ...(cropTypes && { cropTypes }),
                ...(yearsExperience !== undefined && { yearsExperience }),
                updatedAt: new Date()
            },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        console.log("✅ Profile updated successfully");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("❌ Update profile error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update profile",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const logout = async (req, res) => {
    try {
        console.log(`User logout: ${req.user?.email || 'Unknown'}`);
        
        res.status(200).json({ 
            success: true,
            message: "Logout successful. Token removed from client." 
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            success: false,
            error: "Logout failed", 
            details: error.message 
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get user data"
        });
    }
};

const updateUser = async (req, res) => {
    const { name, skills = [], role, email } = req.body;

    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ 
                success: false,
                error: "Forbidden - Admin access required" 
            });
        }

        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: "Email is required" 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        const updateData = {
            ...(name && { name }),
            ...(skills.length && { skills }),
            ...(role && { role }),
            updatedAt: new Date()
        };

        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        console.log(`✅ Admin ${req.user.email} updated user ${updatedUser.email}`);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ 
            success: false,
            error: "Update failed",  
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ 
                success: false,
                error: "Forbidden - Admin access required" 
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { role, search } = req.query;
        let query = {};

        if (role && role !== 'all') {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to retrieve users", 
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "Forbidden - Admin access required"
            });
        }

        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: "Cannot delete your own account"
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        console.log(`✅ Admin ${req.user.email} deleted user ${deletedUser.email}`);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete user",
            details: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};

// Single export block - no duplicates
export {
    signup,
    login,
    updateProfile,
    logout,
    getCurrentUser,
    updateUser,
    getUsers,
    deleteUser
};
