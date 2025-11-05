/**
 * HOME.JSX - AgriAssistify.ai Landing Page
 * Simple home page that uses the Banner component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';  // ✅ Import Banner

const Home = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: "1000+", label: "Active Farmers" },
    { number: "150+", label: "Agricultural Experts" },
    { number: "5000+", label: "Issues Resolved" },
    { number: "90%", label: "Success Rate" }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Farmer from Punjab",
      quote: "AgriAssistify.ai helped me save my wheat crop from pest attack. Got expert help within 2 hours!",
      avatar: "👨‍🌾"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Agricultural Expert",
      quote: "The platform makes it easy to help farmers across India. AI categorization helps me focus on urgent cases.",
      avatar: "👩‍🔬"
    },
    {
      name: "Suresh Patil",
      role: "Farm Manager, Maharashtra",
      quote: "The real-time tracking and expert network have transformed how we manage agricultural challenges.",
      avatar: "👨‍💼"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* ✅ BANNER COMPONENT */}
      <Banner />

      {/* Dynamic Stats Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">🏆 Platform Impact</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">Transforming agricultural communities across India</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 ${
                  currentStat === index ? 'scale-110 bg-green-50 border-2 border-green-200' : 'hover:scale-105'
                }`}
              >
                <div className={`text-5xl font-bold mb-4 ${
                  currentStat === index ? 'text-green-600' : 'text-gray-800'
                }`}>
                  {stat.number}
                </div>
                <p className={`text-xl font-semibold ${
                  currentStat === index ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">🔄 How It Works</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">Simple steps to get expert agricultural guidance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "1", title: "Report Issue", desc: "Describe your agricultural problem with photos and details", icon: "📝", color: "blue" },
              { step: "2", title: "AI Analysis", desc: "Our AI analyzes and categorizes your issue instantly", icon: "🔍", color: "green" },
              { step: "3", title: "Expert Match", desc: "Get connected with the most qualified agricultural expert", icon: "🤝", color: "purple" },
              { step: "4", title: "Get Solution", desc: "Receive personalized guidance and track progress", icon: "✅", color: "orange" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className={`bg-${item.color}-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-2xl`}>
                  {item.step}
                </div>
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">💬 Success Stories</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">Hear from farmers and experts who trust AgriAssistify.ai</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 text-center">{testimonial.avatar}</div>
                <p className="text-gray-700 italic mb-8 text-lg leading-relaxed">"{testimonial.quote}"</p>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900 text-xl">{testimonial.name}</h4>
                  <p className="text-gray-600 text-lg">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl font-bold mb-8">🌾 Ready to Transform Your Farming?</h2>
          <p className="text-2xl text-green-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join thousands of farmers already using AgriAssistify.ai to solve agricultural challenges efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center bg-white text-green-600 font-bold py-5 px-12 rounded-full hover:bg-yellow-50 transition-all duration-200 shadow-2xl transform hover:scale-110 text-xl"
            >
              <span className="mr-3">🚀</span>
              Start Free Today
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center border-3 border-white text-white font-bold py-5 px-12 rounded-full hover:bg-white hover:text-green-600 transition-all duration-200 transform hover:scale-110 text-xl"
            >
              <span className="mr-3">📞</span>
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
