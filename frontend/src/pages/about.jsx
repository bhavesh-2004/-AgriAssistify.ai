/**
 * ABOUT.JSX - AgriAssistify.ai About Page
 * 
 * Comprehensive information about the Intelligent Agriculture Issue Tracker
 * Showcases features, benefits, and mission of the platform
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              🌾 About AgriAssistify.ai
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing agriculture through intelligent technology. Connecting farmers with experts, 
              AI-powered solutions, and comprehensive issue tracking for sustainable farming success.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              AgriAssistify.ai is dedicated to empowering farmers worldwide with cutting-edge technology solutions. 
              We bridge the gap between agricultural challenges and expert knowledge through our intelligent 
              issue tracking and resolution platform.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to ensure no farmer faces agricultural challenges alone. By leveraging AI technology 
              and connecting farmers with qualified agricultural experts, we're building a sustainable future for farming communities.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="bg-green-50 rounded-lg p-8 border border-green-200">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">🎯 Our Vision</h3>
              <p className="text-green-700 leading-relaxed">
                To become the world's most trusted agricultural support platform, where technology meets traditional 
                farming wisdom to create innovative solutions for food security and sustainable agriculture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for modern agricultural challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced artificial intelligence analyzes crop issues, pest problems, and diseases to provide 
                instant recommendations and match you with the right experts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Network</h3>
              <p className="text-gray-600">
                Connect with certified agricultural specialists, crop consultants, and experienced farmers 
                who can provide personalized solutions for your specific challenges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Tracking</h3>
              <p className="text-gray-600">
                Monitor your agricultural issues from report to resolution with intelligent progress tracking, 
                automated updates, and detailed analytics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Notifications</h3>
              <p className="text-gray-600">
                Stay informed with instant email notifications, expert assignments, solution updates, 
                and critical agricultural alerts delivered directly to you.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Coverage</h3>
              <p className="text-gray-600">
                From pest attacks and irrigation issues to equipment problems and crop diseases - 
                we cover all aspects of modern agricultural challenges.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control, encrypted data transmission, 
                and reliable cloud infrastructure ensuring your information is always protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to get expert help for your agricultural challenges</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issue</h3>
              <p className="text-gray-600">
                Describe your agricultural problem with details about location, affected crops, and symptoms.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI system analyzes your issue and categorizes it for optimal expert matching.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Assignment</h3>
              <p className="text-gray-600">
                Qualified agricultural experts are notified and assigned based on their expertise and your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Solution</h3>
              <p className="text-gray-600">
                Receive personalized solutions, track progress, and get ongoing support until resolved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Serve</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 rounded-lg p-8">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Farmers</h3>
              <p className="text-gray-600">
                Small to large-scale farmers seeking expert guidance for crop management, pest control, 
                irrigation optimization, and yield improvement.
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-lg p-8">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Agricultural Workers</h3>
              <p className="text-gray-600">
                Certified agricultural consultants, extension officers, and crop specialists looking 
                to expand their reach and help more farming communities.
              </p>
            </div>

            <div className="text-center bg-gray-50 rounded-lg p-8">
              <div className="text-5xl mb-4">👨‍🌾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Farm Moderators</h3>
              <p className="text-gray-600">
                Farm managers and agricultural supervisors coordinating between farmers and experts 
                for efficient resource allocation and issue resolution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
            <p className="text-lg text-gray-600">Powered by cutting-edge tools for reliability and scalability</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">⚛️</div>
              <h4 className="font-semibold text-gray-900">React.js</h4>
              <p className="text-sm text-gray-600">Modern Frontend</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">🟢</div>
              <h4 className="font-semibold text-gray-900">Node.js</h4>
              <p className="text-sm text-gray-600">Backend Server</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">🍃</div>
              <h4 className="font-semibold text-gray-900">MongoDB</h4>
              <p className="text-sm text-gray-600">Database</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-semibold text-gray-900">AI Integration</h4>
              <p className="text-sm text-gray-600">Smart Analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farming Experience?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers already using AgriAssistify.ai to solve agricultural challenges efficiently.
          </p>
          <div className="space-x-4">
            <Link 
              to="/signup"
              className="bg-white text-green-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
            >
              🚀 Get Started Today
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-200 inline-block"
            >
              📞 Contact Us
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
