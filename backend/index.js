/**
 * INDEX.JS - AgriAssistify.ai Backend Server
 * Enhanced with Gemini AI Integration
 * 
 * This file serves as the main entry point and server configuration 
 * for our "AgriAssistify.ai" Intelligent Agriculture Issue Tracker backend application.
 * 
 * Purpose: Initializes Express server, connects to MongoDB, configures middleware,
 * and enables AI-powered agricultural issue analysis with Gemini API.
 * 
 */

// ==================== IMPORTS ====================
import express from "express"       
import mongoose from "mongoose"       
import cors from "cors"              // Cross-Origin Resource Sharing - allows frontend-backend communication
import dotenv from "dotenv"          // Environment variable loader for secure configuration
import { serve } from "inngest/express"
import userRoutes from "./routes/user.js"  // Authentication routes for farmers, workers, and managers
import ticketRoutes from "./routes/ticket.js"
import { inngest } from "./inngest/client.js"
import { userSignup } from "./inngest/functions/signup.js"
import { onTicketCreated } from "./inngest/functions/ticketCreate.js"

// ==================== CONFIGURATION ====================
dotenv.config()  // Load environment variables from .env file (JWT_SECRET, MONGO_URI, GEMINI_API_KEY, etc.)

// Server port configuration  
const PORT = process.env.PORT || 4000

// ==================== EXPRESS APP SETUP ====================
const app = express()

// ==================== CORS CONFIGURATION FOR DEVELOPMENT ====================
const corsOptions = {
  origin: [
    'http://localhost:3000',    // React Create-React-App default
    'http://localhost:5173',    // Vite React default port
    'http://127.0.0.1:3000',    // Alternative localhost
    'http://127.0.0.1:5173',    // Alternative Vite port
    'http://localhost:5174',    // Backup Vite port
    'http://localhost:3001',    // Alternative React port
    'http://localhost:5175',    // Additional Vite port
    'http://localhost:4173'     // Vite preview port
  ],
  credentials: true,              // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200       // For legacy browser support
}

// ==================== MIDDLEWARE CONFIGURATION ====================
// IMPORTANT: CORS must be applied BEFORE other middleware
app.use(cors(corsOptions))

// Parse JSON payloads from requests (signup/login data, farm issues)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware (optional but helpful)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==================== HEALTH CHECK ENDPOINT ====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌾 AgriAssistify.ai Backend Server is running!",
    version: "2.0.0",
    features: {
      authentication: true,
      ticketManagement: true,
      aiAnalysis: !!process.env.GEMINI_API_KEY,
      emailNotifications: !!process.env.MAILTRAP_SMTP_HOST,
      backgroundJobs: true
    },
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Test endpoint to verify CORS and AI status
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working! Frontend can connect to backend.",
    aiStatus: process.env.GEMINI_API_KEY ? '🤖 Gemini AI Enabled ✅' : '❌ AI Not Configured',
    databaseStatus: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
    origin: req.get('origin'),
    timestamp: new Date().toISOString()
  })
})

// System status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'operational',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      ai: process.env.GEMINI_API_KEY ? 'enabled' : 'disabled',
      email: process.env.MAILTRAP_SMTP_HOST ? 'configured' : 'not configured',
      inngest: 'operational'
    },
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  })
})

// ==================== ROUTES CONFIGURATION ====================
// Mount user authentication routes at /api/auth prefix
// Available endpoints: /api/auth/signup, /api/auth/login, /api/auth/logout
app.use("/api/auth", userRoutes)

// Mount ticket management routes at /api/tickets prefix
// Available endpoints: POST /api/tickets, GET /api/tickets, GET /api/tickets/:id, etc.
app.use("/api/tickets", ticketRoutes)

// Inngest endpoint for background job processing
// Handles AI analysis and email notifications asynchronously
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onTicketCreated, userSignup]
  })
)

// ==================== ERROR HANDLING MIDDLEWARE ====================
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack)
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    })
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    })
  }
  
  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    error: "Something went wrong on the server!",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// ==================== 404 MIDDLEWARE (NO WILDCARDS) ====================
// Use middleware function instead of wildcard routes - Express v5 compatible
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /api/test',
      'GET /api/status',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/tickets',
      'POST /api/tickets',
      'GET /api/tickets/:id',
      'POST /api/tickets/:id/regenerate-ai',
      'GET /api/tickets/stats',
      'POST /api/inngest'
    ]
  })
})

// ==================== DATABASE CONNECTION & SERVER START ====================
const startServer = async () => {
  try {
    // Validate environment variables
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars.join(', '));
      console.error('🔧 Please check your .env file');
      process.exit(1);
    }

    // Connect to MongoDB with options
    await mongoose.connect(process.env.MONGO_URI, {
      // Connection options for better stability
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    console.log("✅ MongoDB Connected Successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🔗 Host: ${mongoose.connection.host}`)
    
    // Verify AI Configuration
    const aiConfigured = !!process.env.GEMINI_API_KEY;
    console.log(`🤖 Gemini AI: ${aiConfigured ? 'Configured ✅' : 'Not Configured ❌'}`)
    
    if (!aiConfigured) {
      console.warn('⚠️  Warning: GEMINI_API_KEY not found. AI analysis will be disabled.');
      console.warn('   Add GEMINI_API_KEY to .env file to enable AI features.');
    }
    
    // Verify Email Configuration
    const emailConfigured = !!(process.env.MAILTRAP_SMTP_HOST && process.env.MAILTRAP_SMTP_USER);
    console.log(`📧 Email Service: ${emailConfigured ? 'Configured ✅' : 'Not Configured ⚠️'}`)
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(``)
      console.log(`╔════════════════════════════════════════════════════════╗`)
      console.log(`║   🚀 AgriAssistify.ai Server RUNNING SUCCESSFULLY!    ║`)
      console.log(`╚════════════════════════════════════════════════════════╝`)
      console.log(``)
      console.log(`🌐 Server Information:`)
      console.log(`   • URL: http://localhost:${PORT}`)
      console.log(`   • Test: http://localhost:${PORT}/api/test`)
      console.log(`   • Status: http://localhost:${PORT}/api/status`)
      console.log(``)
      console.log(`🔐 Authentication:`)
      console.log(`   • Signup: POST http://localhost:${PORT}/api/auth/signup`)
      console.log(`   • Login: POST http://localhost:${PORT}/api/auth/login`)
      console.log(``)
      console.log(`🎫 Ticket Management:`)
      console.log(`   • Create: POST http://localhost:${PORT}/api/tickets`)
      console.log(`   • List: GET http://localhost:${PORT}/api/tickets`)
      console.log(`   • View: GET http://localhost:${PORT}/api/tickets/:id`)
      console.log(`   • AI Regenerate: POST http://localhost:${PORT}/api/tickets/:id/regenerate-ai`)
      console.log(``)
      console.log(`🤖 AI Features: ${aiConfigured ? 'ENABLED' : 'DISABLED'}`)
      console.log(`📧 Email Notifications: ${emailConfigured ? 'ENABLED' : 'DISABLED'}`)
      console.log(``)
      console.log(`🌾 Ready for frontend connections!`)
      console.log(`💡 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(``)
    })

    // Graceful shutdown handlers
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message)
    console.error("")
    console.error("🔧 Troubleshooting Steps:")
    console.error("   1. Check if MongoDB is running:")
    console.error("      • Windows: Check MongoDB service in Task Manager")
    console.error("      • Mac/Linux: Run 'sudo systemctl status mongod'")
    console.error("")
    console.error("   2. Verify MONGO_URI in .env file:")
    console.error("      • Format: mongodb://localhost:27017/agriassistify")
    console.error("      • Current: " + (process.env.MONGO_URI || 'NOT SET'))
    console.error("")
    console.error("   3. Check network connectivity")
    console.error("   4. Ensure MongoDB is accessible on port 27017")
    console.error("")
    process.exit(1)
  }
}

// Graceful shutdown function
async function gracefulShutdown() {
  console.log('')
  console.log('🛑 Shutting down gracefully...')
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed')
    
    console.log('👋 Server stopped successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🔥 Uncaught Exception:', error)
  gracefulShutdown()
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown()
})

// Start the server
startServer()

export default app
