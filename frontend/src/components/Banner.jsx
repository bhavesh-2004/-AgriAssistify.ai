/**
 * HEROBANNER.JSX - AgriAssistify.ai Hero Banner
 * 
 * Professional hero banner for the Intelligent Agriculture Issue Tracker homepage
 * Features agricultural background image with overlay text and call-to-action buttons
 * Matches the AgriPilot.ai design with AgriAssistify.ai branding
 */

// ==================== IMPORTS ====================
import React from 'react'
import { Link } from 'react-router-dom'

// ==================== HERO BANNER COMPONENT ====================
const HeroBanner = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* ==================== BACKGROUND IMAGE WITH OVERLAY ==================== */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://tse4.mm.bing.net/th/id/OIP.K59k2G0bnAjlp3YwYp6tYwHaEK?pid=Api&P=0&h=180')`,
          // Alternative: You can replace this with a real agricultural image
          // backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')"
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Green gradient overlay to match agricultural theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/20 via-green-700/30 to-green-900/40"></div>
      </div>

      {/* ==================== FLOATING AGRICULTURE ELEMENTS ==================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating crop icons */}
        <div className="absolute top-20 left-20 text-6xl text-green-200 opacity-20 animate-bounce">🌾</div>
        <div className="absolute top-40 right-32 text-4xl text-green-200 opacity-30 animate-pulse delay-1000">🌱</div>
        <div className="absolute bottom-32 left-16 text-5xl text-green-200 opacity-25 animate-bounce delay-2000">🚜</div>
        <div className="absolute bottom-20 right-20 text-4xl text-green-200 opacity-20 animate-pulse delay-3000">🌽</div>
        <div className="absolute top-1/2 left-32 text-3xl text-green-200 opacity-15 animate-bounce delay-4000">🍃</div>
        <div className="absolute top-1/4 right-1/4 text-4xl text-green-200 opacity-25 animate-pulse delay-500">💧</div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* ==================== MAIN HEADLINE ==================== */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Unlock values with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400">
              Digitization and AI
            </span>
          </h1>
        </div>

        {/* ==================== SUBTITLE ==================== */}
        <div className="mb-10 animate-fade-in-up animation-delay-200">
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Transform your agricultural operations with our intelligent farm issue tracking platform. 
            <span className="text-yellow-300 font-semibold"> AgriAssistify.ai </span> 
            connects farmers, workers, and experts through AI-powered solutions.
          </p>
        </div>

        {/* ==================== CALL-TO-ACTION BUTTONS ==================== */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-fade-in-up animation-delay-400">
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-900 bg-yellow-400 rounded-lg shadow-xl hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <span className="mr-2">🚀</span>
            Start Your Journey
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link
            to="/about"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-green-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <span className="mr-2">📚</span>
            Learn More
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* ==================== KEY FEATURES PREVIEW ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up animation-delay-600">
          
          {/* AI-Powered Analysis */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-200">Advanced AI analyzes farm issues and provides intelligent solutions instantly</p>
          </div>

          {/* Expert Network */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Expert Network</h3>
            <p className="text-gray-200">Connect with agricultural experts and experienced field workers</p>
          </div>

          {/* Smart Tracking */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Tracking</h3>
            <p className="text-gray-200">Track issue resolution progress with intelligent insights and analytics</p>
          </div>
        </div>

        {/* ==================== STATISTICS STRIP ==================== */}
        <div className="mt-16 animate-fade-in-up animation-delay-800">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">1000+</div>
                <div className="text-sm text-gray-200">Issues Resolved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">500+</div>
                <div className="text-sm text-gray-200">Active Farmers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">200+</div>
                <div className="text-sm text-gray-200">Expert Workers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">95%</div>
                <div className="text-sm text-gray-200">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SCROLL DOWN INDICATOR ==================== */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-white opacity-70">
          <span className="text-sm mb-2">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
