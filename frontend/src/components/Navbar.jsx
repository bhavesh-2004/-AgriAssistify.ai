/**
 * NAVBAR.JSX - AgriAssistify.ai Professional Navigation  
 * Auto-refreshing auth state with storage migration
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check authentication with auto-migration
  useEffect(() => {
    const checkAuth = () => {
      // Prioritize sessionStorage, fallback to localStorage
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Migrate to sessionStorage if currently in localStorage
          if (!sessionStorage.getItem("token") && localStorage.getItem("token")) {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", userData);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            console.log('✅ Auto-migrated auth data to sessionStorage');
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Clear corrupted data from both storages
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes and route changes
    window.addEventListener('storage', checkAuth);
    
    // Also check on route changes
    checkAuth();
    
    return () => window.removeEventListener('storage', checkAuth);
  }, [location.pathname]); // Re-check on route changes

  // Optimized logout handler
  const handleLogout = () => {
    // Clear both storages completely
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setUser(null);
    setIsProfileOpen(false);
    setIsOpen(false);
    
    // Redirect to home page
    navigate("/", { replace: true });
  };

  // Navigation links
  const navigationLinks = [
    { name: 'Home', href: '/', current: location.pathname === '/', protected: false },
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard', protected: true },
    { name: 'Farm Issues', href: '/tickets', current: location.pathname === '/tickets', protected: true },
    { name: 'About', href: '/about', current: location.pathname === '/about', protected: false },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact', protected: false }
  ];

  // Role-specific links
  const getRoleSpecificLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'farmer':
        return [
          { name: 'My Issues', href: '/tickets' },
          { name: 'Create Report', href: '/tickets#create' }
        ];
      case 'worker':
        return [
          { name: 'Assigned Tasks', href: '/tickets?assigned=me' },
          { name: 'All Issues', href: '/tickets' }
        ];
      case 'moderator':
        return [
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'All Issues', href: '/tickets' },
          { name: 'Assign Tasks', href: '/tickets?status=pending' }
        ];
      case 'admin':
        return [
          { name: 'Admin Panel', href: '/admin' },
          { name: 'User Management', href: '/admin#users' },
          { name: 'Analytics', href: '/dashboard' }
        ];
      default:
        return [];
    }
  };

  // Role icons
  const getRoleIcon = (role) => {
    const icons = {
      farmer: '🌱',
      worker: '🔧',
      moderator: '👨‍🌾',
      admin: '👑'
    };
    return icons[role] || '👤';
  };

  return (
    <nav className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="text-white font-bold text-xl tracking-wide">
                agriassistify<span className="text-yellow-300">.ai</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationLinks
                .filter(link => !link.protected || user)
                .map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    link.current
                      ? 'text-yellow-300 border-b-2 border-yellow-300'
                      : 'text-white hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile & Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? (
              /* Authenticated User */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-green-800 font-bold text-sm">
                      {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-green-100 capitalize">
                      {getRoleIcon(user.role)} {user.role}
                    </p>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                      <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                      <p className="text-xs text-gray-600 capitalize flex items-center">
                        {getRoleIcon(user.role)} {user.role} Account
                      </p>
                    </div>
                    
                    {/* Role-specific Links */}
                    <div className="py-2">
                      {getRoleSpecificLinks().map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    
                    <hr className="border-gray-200 my-2" />
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      👤 Profile Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated User */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-yellow-500 hover:bg-yellow-400 text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:scale-105 transform"
                >
                  🚀 Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors duration-200"
            >
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-800 border-t border-green-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            
            {/* Navigation Links */}
            {navigationLinks
              .filter(link => !link.protected || user)
              .map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                  link.current
                    ? 'text-yellow-300 bg-green-700'
                    : 'text-white hover:text-yellow-200 hover:bg-green-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {/* User Section for Mobile */}
            {user ? (
              <div className="border-t border-green-600 pt-4 mt-4">
                <div className="px-3 py-2 bg-green-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
                      <span className="text-green-800 font-bold text-sm">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-yellow-300 font-medium text-sm">{user.name || user.email.split('@')[0]}</p>
                      <p className="text-green-100 text-xs capitalize">
                        {getRoleIcon(user.role)} {user.role}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  {getRoleSpecificLinks().map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block px-3 py-2 text-white hover:bg-green-700 transition-colors duration-200 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-2 space-y-1 border-t border-green-600 pt-2">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-white hover:bg-green-700 transition-colors duration-200 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    👤 Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-300 hover:bg-green-700 transition-colors duration-200 rounded-md"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-green-600 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-white hover:bg-green-700 transition-colors duration-200 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 bg-yellow-500 text-green-800 rounded-md font-medium hover:bg-yellow-400 transition-colors duration-200 mx-3"
                  onClick={() => setIsOpen(false)}
                >
                  🚀 Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
