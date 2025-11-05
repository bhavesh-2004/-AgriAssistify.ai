/**
 * MAIN.JSX - AgriAssistify.ai Frontend Entry Point
 * 
 * Sets up React routing for the Intelligent Agriculture Issue Tracker
 * Defines protected and public routes with authentication wrapper
 * Handles navigation between farmer, worker, moderator, and admin interfaces
 */

// ==================== IMPORTS ====================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './index.css'

// ==================== COMPONENT IMPORTS ====================
import CheckAuth from './components/auth.jsx'   
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// ==================== PAGE IMPORTS ====================
import Dashboard from './pages/dashboard.jsx'
import Tickets from './pages/tickets.jsx'
import Ticket from './pages/ticket.jsx'       
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'
import Profile from './pages/profile.jsx'
import About from './pages/about.jsx'  // ✅ Using your comprehensive About page

// ==================== LAYOUT WRAPPER COMPONENT ====================
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

// ==================== HOME/LANDING PAGE COMPONENT ====================
const Home = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-6xl mb-4 block">🌾</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AgriAssistify.ai
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Intelligent Agriculture Issue Tracker powered by AI
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 max-w-3xl mx-auto">
            Join thousands of farmers, agricultural workers, and moderators using our AI-powered platform 
            to solve farming challenges efficiently. Get expert guidance, track issue resolution, and 
            optimize your agricultural operations with cutting-edge technology.
          </p>
          
          <div className="flex justify-center space-x-4 mt-8">
            <a
              href="/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              🚀 Get Started
            </a>
            <a
              href="/login"
              className="bg-white hover:bg-gray-50 text-green-600 font-medium py-3 px-6 rounded-lg border-2 border-green-600 transition-colors duration-200"
            >
              📝 Sign In
            </a>
            <a
              href="/about"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              📖 Learn More
            </a>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="text-4xl mb-4 block">🤖</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">Advanced AI analyzes farm issues and provides intelligent solutions instantly</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="text-4xl mb-4 block">👥</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Network</h3>
            <p className="text-gray-600">Connect with certified agricultural experts and experienced workers 24/7</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="text-4xl mb-4 block">📊</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Tracking</h3>
            <p className="text-gray-600">Track issue resolution progress with intelligent insights and analytics</p>
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-16 bg-green-50 rounded-lg py-12 px-8">
          <h2 className="text-2xl font-bold text-green-800 mb-8">Platform Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <p className="text-green-700">Active Farmers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-green-700">Agricultural Experts</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5000+</div>
              <p className="text-green-700">Issues Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-green-700">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

// ==================== CONTACT PAGE COMPONENT ====================
const Contact = () => (
  <Layout>
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact AgriAssistify.ai</h1>
        <p className="text-xl text-gray-600">Get in touch with our agricultural support team</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get Support</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-gray-600">support@agriassistify.ai</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-semibold">Phone Support</p>
                <p className="text-gray-600">(+91) 9322545899</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-semibold">Emergency Line</p>
                <p className="text-gray-600">Available 24/7 for critical agricultural issues</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold">Live Chat</p>
                <p className="text-gray-600">Available 6 AM - 10 PM IST</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <a 
              href="/signup" 
              className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="font-semibold text-green-800">🚀 Start Using Platform</h3>
              <p className="text-green-600">Create account and report your first issue</p>
            </a>
            
            <a 
              href="/about" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-800">📖 Learn More</h3>
              <p className="text-blue-600">Discover platform features and capabilities</p>
            </a>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800">🏢 Office Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9 AM - 6 PM IST</p>
              <p className="text-gray-600">Emergency support: 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

// ==================== ROOT RENDER ====================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        
        {/* Landing/Home page - NOT PROTECTED */}
        <Route
          path="/"
          element={
            <CheckAuth protectedRoute={false}>
              <Home />
            </CheckAuth>
          }
        />

        {/* Authentication Routes - NOT PROTECTED */}
        <Route
          path="/login"
          element={
            <CheckAuth protectedRoute={false}>
              <Login />
            </CheckAuth>
          }
        />

        <Route
          path="/signup"
          element={
            <CheckAuth protectedRoute={false}>
              <Signup />
            </CheckAuth>
          }
        />

        {/* ==================== PROTECTED ROUTES ==================== */}
        
        {/* Dashboard - PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <CheckAuth protectedRoute={true}>
              <Dashboard />
            </CheckAuth>
          }
        />

        {/* Tickets Management - PROTECTED */}
        <Route
          path="/tickets"
          element={
            <CheckAuth protectedRoute={true}>
              <Tickets />
            </CheckAuth>
          }
        />

        {/* Single Ticket View - PROTECTED */}
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protectedRoute={true}>
              <Ticket />  
            </CheckAuth>
          }
        />

        {/* User Profile Management - PROTECTED */}
        <Route
          path="/profile"
          element={
            <CheckAuth protectedRoute={true}>
              <Profile />
            </CheckAuth>
          }
        />

        {/* Admin Panel - PROTECTED */}
        <Route
          path="/admin"
          element={
            <CheckAuth protectedRoute={true}>
              <Admin />
            </CheckAuth>
          }
        />

        {/* ==================== STATIC PAGES - NOT PROTECTED ==================== */}
        
        {/* ✅ About Page - Using your comprehensive About component */}
        <Route
          path="/about"
          element={
            <CheckAuth protectedRoute={false}>
              <About />
            </CheckAuth>
          }
        />

        {/* Enhanced Contact Page */}
        <Route
          path="/contact"
          element={
            <CheckAuth protectedRoute={false}>
              <Contact />
            </CheckAuth>
          }
        />

        {/* 404 Fallback - NOT PROTECTED */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-6xl mb-4 block">🌾</span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-8">
                  The page you're looking for doesn't exist in our agricultural platform.
                </p>
                <div className="space-x-4">
                  <a
                    href="/"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
                  >
                    🏠 Return Home
                  </a>
                  <a
                    href="/about"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
                  >
                    📖 Learn About Platform
                  </a>
                </div>
              </div>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
