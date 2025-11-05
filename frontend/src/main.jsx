/**
 * MAIN.JSX - AgriAssistify.ai Frontend Entry Point
 * Fixed import paths to match your existing files
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './index.css'

// Component imports
import CheckAuth from './components/auth.jsx'   
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// ✅ CORRECTED PAGE IMPORTS - Match your actual file names
import Home from './pages/home.jsx'        // ✅ lowercase 'home'
import Contact from './pages/contact.jsx'  // ✅ lowercase 'contact'  
import Dashboard from './pages/dashboard.jsx'
import Tickets from './pages/tickets.jsx'
import Ticket from './pages/ticket.jsx'       
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'
import Profile from './pages/profile.jsx'
import About from './pages/about.jsx'

// Layout wrapper
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

// 404 Page Component
const NotFound = () => (
  <Layout>
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
      <span className="text-8xl mb-6 block">🌾</span>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">
        The page you're looking for doesn't exist in our agricultural platform.
      </p>
      <div className="space-x-4">
        <a
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
        >
          🏠 Return Home
        </a>
        <a
          href="/about"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
        >
          📖 Learn About Platform
        </a>
      </div>
    </div>
  </Layout>
);

// Root render
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<CheckAuth protectedRoute={false}><Home /></CheckAuth>} />
        <Route path="/login" element={<CheckAuth protectedRoute={false}><Login /></CheckAuth>} />
        <Route path="/signup" element={<CheckAuth protectedRoute={false}><Signup /></CheckAuth>} />
        <Route path="/about" element={<CheckAuth protectedRoute={false}><About /></CheckAuth>} />
        <Route path="/contact" element={<CheckAuth protectedRoute={false}><Contact /></CheckAuth>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<CheckAuth protectedRoute={true}><Dashboard /></CheckAuth>} />
        <Route path="/tickets" element={<CheckAuth protectedRoute={true}><Tickets /></CheckAuth>} />
        <Route path="/tickets/:id" element={<CheckAuth protectedRoute={true}><Ticket /></CheckAuth>} />
        <Route path="/profile" element={<CheckAuth protectedRoute={true}><Profile /></CheckAuth>} />
        <Route path="/admin" element={<CheckAuth protectedRoute={true}><Admin /></CheckAuth>} />
        
        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
