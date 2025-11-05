/**
 * INDEX.JS - AgriAssistify.ai Backend Server
 * 
 * This file serves as the main entry point and server configuration 
 * for our "AgriAssistify.ai" Intelligent Agriculture Issue Tracker backend application.
 * 
 * Purpose: Initializes Express server, connects to MongoDB, and configures middleware
 * for handling farmer/worker authentication and farm issue management.
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
dotenv.config()  // Load environment variables from .env file (JWT_SECRET, MONGO_URI, etc.)

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
    'http://localhost:3001'     // Alternative React port
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

// ==================== HEALTH CHECK ENDPOINT ====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌾 AgriAssistify.ai Backend Server is running!",
    timestamp: new Date().toISOString(),
    port: PORT
  })
})

// Test endpoint to verify CORS
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working! Frontend can connect to backend.",
    origin: req.get('origin'),
    timestamp: new Date().toISOString()
  })
})

// ==================== ROUTES CONFIGURATION ====================
// Mount user authentication routes at /api/auth prefix
// Available endpoints: /api/auth/signup, /api/auth/login, /api/auth/logout
app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)

// Inngest endpoint for background job processing
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onTicketCreated, userSignup]
  })
)

// ==================== ERROR HANDLING MIDDLEWARE ====================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  res.status(500).json({
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
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/tickets',
      'POST /api/tickets'
    ]
  })
})

// ==================== DATABASE CONNECTION & SERVER START ====================
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    
    console.log("✅ MongoDB Connected Successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(``)
      console.log(`🚀 AgriAssistify.ai Server RUNNING SUCCESSFULLY!`)
      console.log(`   • URL: http://localhost:${PORT}`)
      console.log(`   • Test: http://localhost:${PORT}/api/test`)
      console.log(`   • Signup: http://localhost:${PORT}/api/auth/signup`)
      console.log(`🌾 Ready for frontend connections!`)
      console.log(``)
    })

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message)
    console.error("🔧 Please check:")
    console.error("   • MongoDB is running")
    console.error("   • MONGO_URI in .env file is correct")
    console.error("   • Network connectivity")
    process.exit(1)
  }
}

// Start the server
startServer()

export default app
