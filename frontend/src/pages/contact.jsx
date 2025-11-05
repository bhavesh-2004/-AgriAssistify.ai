/**
 * CONTACT.JSX - AgriAssistify.ai Contact Page
 * 
 * Professional contact page with multiple support channels,
 * interactive elements, and agricultural theme
 */

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    urgency: 'medium'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you! Your message has been sent. We\'ll respond within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">📞 Contact AgriAssistify.ai</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Get expert agricultural support 24/7. We're here to help solve your farming challenges efficiently.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🌾 Send Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">🟢 Low - General Inquiry</option>
                  <option value="medium">🟡 Medium - Need Help</option>
                  <option value="high">🔴 High - Urgent Agricultural Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your agricultural challenge in detail..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
              >
                🚀 Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Support Channels */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">📞 Get Support</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-3xl">📧</span>
                  <div>
                    <h3 className="font-bold text-blue-800">Email Support</h3>
                    <p className="text-blue-600">support@agriassistify.ai</p>
                    <p className="text-sm text-blue-500">Response within 4 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-3xl">📞</span>
                  <div>
                    <h3 className="font-bold text-green-800">Phone Support</h3>
                    <p className="text-green-600">(+91) 9322545899</p>
                    <p className="text-sm text-green-500">Available 24/7 for emergencies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <span className="text-3xl">🚨</span>
                  <div>
                    <h3 className="font-bold text-red-800">Emergency Helpline</h3>
                    <p className="text-red-600">1800-AGRI-HELP</p>
                    <p className="text-sm text-red-500">Critical crop issues only</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-3xl">💬</span>
                  <div>
                    <h3 className="font-bold text-purple-800">Live Chat</h3>
                    <p className="text-purple-600">Available on platform</p>
                    <p className="text-sm text-purple-500">6 AM - 10 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">⚡ Quick Actions</h3>
              
              <div className="space-y-4">
                <a 
                  href="/signup" 
                  className="block p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-all duration-200 hover:shadow-md"
                >
                  <h4 className="font-bold text-green-800 flex items-center">
                    🚀 <span className="ml-2">Start Using Platform</span>
                  </h4>
                  <p className="text-green-600 mt-1">Create account and report your first agricultural issue</p>
                </a>
                
                <a 
                  href="/about" 
                  className="block p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:shadow-md"
                >
                  <h4 className="font-bold text-blue-800 flex items-center">
                    📖 <span className="ml-2">Learn More</span>
                  </h4>
                  <p className="text-blue-600 mt-1">Discover platform features and AI capabilities</p>
                </a>

                <a 
                  href="/login" 
                  className="block p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                >
                  <h4 className="font-bold text-gray-800 flex items-center">
                    🔐 <span className="ml-2">Sign In</span>
                  </h4>
                  <p className="text-gray-600 mt-1">Access your agricultural dashboard</p>
                </a>
              </div>
            </div>

            {/* Office Information */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6">🏢 Office Information</h3>
              
              <div className="space-y-4 text-green-700">
                <div>
                  <h4 className="font-semibold">Business Hours:</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                  <p>Sunday: Emergency support only</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Response Times:</h4>
                  <p>• Critical Issues: Within 1 hour</p>
                  <p>• General Support: Within 4 hours</p>
                  <p>• Feature Requests: Within 24 hours</p>
                </div>

                <div>
                  <h4 className="font-semibold">Languages Supported:</h4>
                  <p>English, हिंदी, मराठी, ગુજરાતી, தமிழ்</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">❓ Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">How quickly can I get help with crop issues?</h4>
              <p className="text-gray-600">Our agricultural experts typically respond within 1 hour for urgent issues and 4 hours for general inquiries.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Is the platform free for farmers?</h4>
              <p className="text-gray-600">Basic issue reporting and expert consultation is completely free. Premium features available for advanced analytics.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-2">What types of agricultural issues can you help with?</h4>
              <p className="text-gray-600">Pest control, irrigation problems, crop diseases, equipment issues, harvest optimization, and general farming guidance.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Do you provide support in regional languages?</h4>
              <p className="text-gray-600">Yes! We support Hindi, Marathi, Gujarati, Tamil, and other major Indian languages for better communication.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
