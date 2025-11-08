/**
 * INDEX.JS - AgriAssistify.ai Backend Server
 * Enhanced with Gemini AI Integration & Production CORS Support
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
import cors from "cors"              
import dotenv from "dotenv"          
import { serve } from "inngest/express"
import userRoutes from "./routes/user.js"
import ticketRoutes from "./routes/ticket.js"
import { inngest } from "./inngest/client.js"
import { userSignup } from "./inngest/functions/signup.js"
import { onTicketCreated } from "./inngest/functions/ticketCreate.js"

// ==================== CONFIGURATION ====================
dotenv.config()

const PORT = process.env.PORT || 4000
const app = express()

// ==================== PRODUCTION + DEVELOPMENT CORS CONFIGURATION ====================
const allowedOrigins = [
  // Development origins (localhost)
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3001',
  'http://localhost:5175',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  
  // Production origins (Vercel)
  'https://agriassistify-ai.vercel.app',
  'https://agriassistify-ai-vercel.app',
  
  // Add custom domain if you have one
  process.env.FRONTEND_URL
].filter(Boolean) // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true)
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      console.warn(`⚠️  CORS blocked request from origin: ${origin}`)
      callback(new Error('Not allowed by CORS policy'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  maxAge: 600, // Cache preflight requests for 10 minutes
  preflightContinue: false // Important: Let CORS middleware handle OPTIONS
}

// ==================== MIDDLEWARE CONFIGURATION ====================
// IMPORTANT: CORS must be applied BEFORE other middleware
app.use(cors(corsOptions))

// ✅ REMOVED: app.options('*', cors(corsOptions)) - This line was causing PathError

// Parse JSON payloads from requests
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  const origin = req.get('origin') || 'direct'
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${origin}`)
  next()
})

// ==================== HEALTH CHECK ENDPOINTS ====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌾 AgriAssistify.ai Backend Server is running!",
    version: "2.1.0",
    features: {
      authentication: true,
      ticketManagement: true,
      aiAnalysis: !!process.env.GEMINI_API_KEY,
      emailNotifications: !!process.env.MAILTRAP_SMTP_HOST,
      backgroundJobs: true,
      corsEnabled: true
    },
    allowedOrigins: allowedOrigins.filter(Boolean),
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Test endpoint to verify CORS
app.get('/api/test', (req, res) => {
  const origin = req.get('origin')
  res.status(200).json({
    success: true,
    message: "✅ CORS is working! Frontend can connect to backend.",
    aiStatus: process.env.GEMINI_API_KEY ? '🤖 Gemini AI Enabled ✅' : '❌ AI Not Configured',
    databaseStatus: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
    requestOrigin: origin || 'No origin (direct request)',
    allowedOrigins: allowedOrigins.filter(Boolean),
    corsAllowed: !origin || allowedOrigins.includes(origin),
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
      inngest: 'operational',
      cors: 'enabled'
    },
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

// ==================== ROUTES CONFIGURATION ====================
app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)

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
  
  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.get('origin'),
      allowedOrigins: allowedOrigins.filter(Boolean)
    })
  }
  
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

// ==================== 404 MIDDLEWARE ====================
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
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars.join(', '))
      console.error('🔧 Please check your .env file')
      process.exit(1)
    }

    // Connect to MongoDB with options
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    console.log("✅ MongoDB Connected Successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🔗 Host: ${mongoose.connection.host}`)
    
    // Verify AI Configuration
    const aiConfigured = !!process.env.GEMINI_API_KEY
    console.log(`🤖 Gemini AI: ${aiConfigured ? 'Configured ✅' : 'Not Configured ❌'}`)
    
    if (!aiConfigured) {
      console.warn('⚠️  Warning: GEMINI_API_KEY not found. AI analysis will be disabled.')
      console.warn('   Add GEMINI_API_KEY to .env file to enable AI features.')
    }
    
    // Verify Email Configuration
    const emailConfigured = !!(process.env.MAILTRAP_SMTP_HOST && process.env.MAILTRAP_SMTP_USER)
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
      console.log(`   • Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(``)
      console.log(`🔐 Authentication:`)
      console.log(`   • Signup: POST http://localhost:${PORT}/api/auth/signup`)
      console.log(`   • Login: POST http://localhost:${PORT}/api/auth/login`)
      console.log(``)
      console.log(`🎫 Ticket Management:`)
      console.log(`   • Create: POST http://localhost:${PORT}/api/tickets`)
      console.log(`   • List: GET http://localhost:${PORT}/api/tickets`)
      console.log(``)
      console.log(`🌍 CORS Allowed Origins:`)
      allowedOrigins.filter(Boolean).forEach(origin => {
        console.log(`   • ${origin}`)
      })
      console.log(``)
      console.log(`🤖 AI Features: ${aiConfigured ? 'ENABLED' : 'DISABLED'}`)
      console.log(`📧 Email Notifications: ${emailConfigured ? 'ENABLED' : 'DISABLED'}`)
      console.log(``)
      console.log(`🌾 Ready for frontend connections!`)
      console.log(``)
    })

    // Graceful shutdown handlers
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message)
    console.error("")
    console.error("🔧 Troubleshooting Steps:")
    console.error("   1. Check if MongoDB is running")
    console.error("   2. Verify MONGO_URI in .env file")
    console.error("      • Current: " + (process.env.MONGO_URI || 'NOT SET'))
    console.error("")
    process.exit(1)
  }
}

// Graceful shutdown function
async function gracefulShutdown() {
  console.log('')
  console.log('🛑 Shutting down gracefully...')
  
  try {
    await mongoose.connection.close()
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
