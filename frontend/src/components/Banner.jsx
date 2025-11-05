/**
 * BANNER.JSX - AgriAssistify.ai Hero Banner with Integrated Carousel
 * Full-screen banner with changing background images (no slide counter)
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 4 Agricultural Background Images
  const backgroundImages = [
    {
      id: 1,
      image: "https://www.lek.com/sites/default/files/hero-images/insights/PT_argo-survey_hero_0.jpg",
      title: "Smart Farming Technology"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80", 
      title: "Sustainable Agriculture"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Modern Farm Equipment"
    },
    {
      id: 4,
      image: "https://www.onsetcomp.com/sites/default/files/styles/hero_banner/public/2022-09/HERO-Disease-Pest-Management1.jpg?itok=uMcpwNCj",
      title: "Monitoring Solutions for Disease & Pest Management"
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Navigation functions
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* Carousel Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
            {/* Green gradient overlay for agricultural theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-green-800/20"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-4 transition-all duration-200 z-20 group"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-4 transition-all duration-200 z-20 group"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Content Overlay */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Main Headline */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
            Unlock values with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400">
              Digitization and AI
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-10">
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Transform your agricultural operations with our intelligent farm issue tracking platform. 
            <span className="text-yellow-300 font-semibold"> AgriAssistify.ai </span> 
            connects farmers, workers, and experts through AI-powered solutions.
          </p>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Link
            to="/signup"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-900 bg-yellow-400 rounded-lg shadow-2xl hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">🚀</span>
            Start Your Journey
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link
            to="/about"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-green-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <span className="mr-2">📚</span>
            Learn More
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Current Slide Title */}
        <div className="mb-8">
          <p className="text-lg text-yellow-300 font-semibold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
            {backgroundImages[currentSlide].title}
          </p>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-yellow-400 scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/75 hover:scale-110'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce z-20">
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

export default Banner
