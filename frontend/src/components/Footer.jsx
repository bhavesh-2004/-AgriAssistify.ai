/**
 * FOOTER.JSX - AgriAssistify.ai Professional Footer
 * 
 * Professional footer component for the Intelligent Agriculture Issue Tracker
 * Features company info, additional menu links, newsletter signup, and social media
 * Matches the clean, professional design of AgriPilot.ai with agriculture theming
 */

// ==================== IMPORTS ====================
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// ==================== FOOTER COMPONENT ====================
function Footer() {
    // ==================== STATE MANAGEMENT ====================
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)
    const [subscribing, setSubscribing] = useState(false)

    // ==================== NEWSLETTER HANDLER ====================
    const handleNewsletterSubmit = async (e) => {
        e.preventDefault()
        if (email.trim() && !subscribing) {
            setSubscribing(true)
            
            try {
                // Here you would typically send the email to your backend
                // const res = await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                console.log('Newsletter subscription:', email)
                setSubscribed(true)
                setEmail('')
                
                // Reset success message after 3 seconds
                setTimeout(() => setSubscribed(false), 3000)
            } catch (error) {
                console.error('Newsletter subscription error:', error)
            } finally {
                setSubscribing(false)
            }
        }
    }

    // ==================== SCROLL TO TOP ====================
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ==================== RENDER COMPONENT ====================
    return (
        <footer className="bg-gray-100 pt-16 pb-8 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ==================== MAIN FOOTER CONTENT ==================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* ==================== COMPANY INFO SECTION ==================== */}
                    <div className="lg:col-span-1">
                        {/* Logo */}
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                                <span className="text-white text-2xl">🌾</span>
                            </div>
                            <div className="text-gray-800 font-bold text-xl tracking-wide">
                                agriassistify<span className="text-green-600">.ai</span>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span className="text-sm">contact@agriassistify.ai</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <span className="text-sm">(+91)9322545899</span>
                            </div>
                        </div>
                    </div>

                    {/* ==================== ADDITIONAL MENU SECTION ==================== */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-6 uppercase tracking-wide">
                            Additional Menu
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    HOME
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    ABOUT US
                                </Link>
                            </li>
                            <li>
                                <Link to="/solutions" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    SOLUTIONS
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    CONTACT US
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ==================== SERVICES MENU SECTION ==================== */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-6 uppercase tracking-wide">
                            Services
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/case-studies" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    CASE STUDIES
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    GALLERY
                                </Link>
                            </li>
                            <li>
                                <Link to="/tickets" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    FARM ISSUE TRACKING
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm">
                                    AI AGRICULTURAL ASSISTANCE
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ==================== NEWSLETTER SECTION ==================== */}
                    <div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-6 uppercase tracking-wide">
                            Get A Newsletter
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                            An integrated smart Agri solution for modern farming challenges
                        </p>
                        
                        {/* Newsletter Form */}
                        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={subscribing}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 text-sm ${
                                    subscribing
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : subscribed
                                        ? 'bg-green-500 text-white'
                                        : 'bg-green-400 hover:bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                                }`}
                            >
                                {subscribing ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Subscribing...</span>
                                    </span>
                                ) : subscribed ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <span>✓</span>
                                        <span>Subscribed!</span>
                                    </span>
                                ) : (
                                    'Subscribe'
                                )}
                            </button>
                        </form>
                        
                        {subscribed && (
                            <p className="mt-3 text-green-600 text-sm">
                                Thank you for subscribing to our newsletter!
                            </p>
                        )}
                    </div>
                </div>

                {/* ==================== BOTTOM FOOTER SECTION ==================== */}
                <div className="border-t border-gray-300 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        
                        {/* Copyright */}
                        <div className="text-gray-600 text-sm">
                            © Copyright AgriAssistify.ai 2025 | All Right Reserved.
                        </div>

                        {/* Legal Links */}
                        <div className="flex items-center space-x-8">
                            <Link 
                                to="/privacy-policy" 
                                className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                to="/terms-conditions" 
                                className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200"
                            >
                                Terms and Conditions
                            </Link>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex items-center space-x-3">
                            <a 
                                href="https://facebook.com/agriassistify" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-400 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            
                            <a 
                                href="https://instagram.com/agriassistify" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-400 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                                </svg>
                            </a>

                            <a 
                                href="https://linkedin.com/company/agriassistify" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-400 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>

                            <a 
                                href="https://youtube.com/@agriassistify" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-400 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="YouTube"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>

                            <a 
                                href="https://twitter.com/agriassistify" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="Twitter"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ==================== SCROLL TO TOP BUTTON ==================== */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <svg className="w-6 h-6 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </footer>
    )
}

export default Footer
