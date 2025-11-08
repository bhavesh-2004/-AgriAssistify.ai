/**
 * CONTACT.JSX - Full Web3Forms integration
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for Web3Forms
      const formPayload = new FormData();
      
      // Add Web3Forms access key
      formPayload.append("access_key", "83fbaec5-c98b-4032-9cfd-ded66fb02657");
      
      // Add form fields
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("subject", `[${formData.urgency.toUpperCase()}] ${formData.subject}`);
      formPayload.append("message", `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌾 AgriAssistify.ai Contact Form
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Contact Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${formData.name}
📧 Email: ${formData.email}
📌 Subject: ${formData.subject}
🚨 Urgency: ${formData.urgency.toUpperCase()}

💬 Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
🌐 Platform: AgriAssistify.ai
      `);

      // Send to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formPayload
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Success! Your message has been sent. We\'ll respond within 24 hours based on urgency level.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          urgency: 'medium'
        });
      } else {
        alert('❌ Failed to send message. Please try again or contact us directly at support@agriassistify.ai');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Main Content - Contact Form Only */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🌾 Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Urgency *
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Low - General Inquiry</option>
                <option value="medium">🟡 Medium - Need Help</option>
                <option value="high">🔴 High - Urgent Agricultural Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Brief description of your issue"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your agricultural challenge in detail..."
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Message...
                </span>
              ) : (
                '🚀 Send Message'
              )}
            </button>
          </form>

          {/* Contact Info Below Form */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600 text-sm">support@agriassistify.ai</p>
              </div>
              
              <div className="p-4">
                <div className="text-3xl mb-2">📞</div>
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600 text-sm">(+91) 9322545899</p>
              </div>
              
              <div className="p-4">
                <div className="text-3xl mb-2">⏰</div>
                <h3 className="font-semibold text-gray-800">Response Time</h3>
                <p className="text-gray-600 text-sm">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
