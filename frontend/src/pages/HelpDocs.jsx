/**
 * HELPDOCS.JSX - AgriAssistify.ai Help & Documentation
 * 
 * Comprehensive help center with guides, FAQs, and troubleshooting
 * resources for all user roles
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpDocs = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // ==================== DOCUMENTATION CATEGORIES ====================
  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'features', name: 'Platform Features', icon: '✨' },
    { id: 'tickets', name: 'Issue Management', icon: '📋' },
    { id: 'ai-assistant', name: 'AI Assistant', icon: '🤖' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'faq', name: 'FAQ', icon: '❓' }
  ];

  // ==================== DOCUMENTATION CONTENT ====================
  const documentation = {
    'getting-started': {
      title: 'Getting Started with AgriAssistify.ai',
      sections: [
        {
          title: '1. Create Your Account',
          content: `
            • Visit the signup page and choose your role (Farmer, Worker, Moderator, or Admin)
            • Enter your name, email, and secure password
            • Verify your email address
            • Complete your profile with farm details
          `,
          tips: 'Use a strong password with at least 8 characters including numbers and symbols.'
        },
        {
          title: '2. Complete Your Profile',
          content: `
            • Add your farm location and size
            • Specify primary crops you grow
            • Add contact information for Email notifications
          `,
          tips: 'Accurate profile information helps AI provide better recommendations.'
        },
        {
          title: '3. Report Your First Issue',
          content: `
            • Click "Report Issue" from dashboard
            • Select issue type (Pest, Disease, Irrigation, Equipment, etc.)
            • Provide detailed description
            • Set urgency level
            • Submit for AI analysis
          `,
          tips: 'Include as many details as possible for accurate AI diagnosis.'
        },
        {
          title: '4. Track Issue Resolution',
          content: `
            • View your issues on the dashboard
            • Check AI-generated solutions
            • Monitor status changes (Pending → In Progress → Resolved)
            • Receive notifications on updates
          `,
          tips: 'Enable notifications to stay updated on issue progress.'
        }
      ]
    },
    'features': {
      title: 'Platform Features Guide',
      sections: [
        {
          title: '🌾 Smart Dashboard',
          content: `
            • Real-time statistics of all farm issues
            • Quick access to pending, in-progress, and resolved tickets
            • Recent activity timeline
            • Role-specific views (Farmer, Worker, Moderator, Admin)
            • Quick action buttons for common tasks
          `,
          tips: 'Dashboard updates in real-time - refresh to see latest changes.'
        },
        {
          title: '📊 Issue Tracking System',
          content: `
            • Create detailed farm issue tickets
            • Upload photos of affected crops
            • Set priority levels (Low, Medium, High)
            • Assign issues to workers
            • Track resolution progress
            • View complete issue history
          `,
          tips: 'Photos help AI provide more accurate solutions.'
        },
        {
          title: '👥 Role-Based Access',
          content: `
            • Farmer: Report issues, track personal tickets
            • Worker: View assigned tasks, update status
            • Moderator: Oversee all operations, assign workers
            • Admin: Full platform management, analytics
          `,
          tips: 'Each role has specific permissions for security.'
        },
        {
          title: '🔔 Notification System',
          content: `
            • Email notifications for important updates
            • Status change alerts
            • AI solution ready notifications
            • Assignment notifications for workers
            • Customizable notification preferences
          `,
          tips: 'Configure notification settings in your profile.'
        }
      ]
    },
    'tickets': {
      title: 'Issue Management Guide',
      sections: [
        {
          title: 'Creating an Issue Ticket',
          content: `
            Step-by-step process:
            
            1. Navigate to "Report Issue" or click "📝 Report Issue" button
            2. Fill in required information:
               • Issue Title: Brief description (e.g., "Pink Bollworm in Cotton")
               • Issue Type: Select from dropdown (Pest, Disease, Irrigation, etc.)
               • Field Location: Specify plot/section
               • Affected Crop: Enter crop name
               • Urgency: Low/Medium/High
               • Detailed Description: Explain symptoms, extent of damage
               • Estimated Impact: Area affected, expected loss
            3. Click "Submit Issue"
            4. AI will analyze and provide solutions within seconds
          `,
          tips: 'More details = better AI recommendations!'
        },
        {
          title: 'Understanding Issue Status',
          content: `
            • PENDING: Newly created, awaiting AI analysis
            • IN_PROGRESS: Assigned to worker, being resolved
            • RESOLVED: Solution implemented, issue fixed
            • CLOSED: Completed and archived
          `,
          tips: 'You can comment on tickets to add updates.'
        },
        {
          title: 'Viewing AI Solutions',
          content: `
            AI provides:
            • Summary: Quick overview of the problem
            • Solution: Step-by-step treatment plan
            • Recommendations: Products and methods with INR prices
            • Possible Causes: Why this issue occurred
            • Prevention Tips: How to avoid future occurrences
            • Helpful Notes: Additional agricultural guidance
          `,
          tips: 'Follow AI recommendations carefully for best results.'
        }
      ]
    },
    'ai-assistant': {
      title: 'AI Assistant Guide',
      sections: [
        {
          title: '🤖 How AI Analysis Works',
          content: `
            AgriAssistify.ai uses Google Gemini 2.5 Flash to:
            
            1. Analyze your issue description
            2. Identify pest/disease/problem type
            3. Research best agricultural practices
            4. Generate India-specific solutions
            5. Provide cost estimates in INR
            6. Suggest prevention measures
            
            Processing time: 5-15 seconds
          `,
          tips: 'AI learns from each interaction to provide better solutions.'
        },
        {
          title: '🔄 Regenerating AI Solutions',
          content: `
            If AI solution needs improvement:
            • Click "Regenerate AI Solution" button
            • AI will re-analyze with enhanced parameters
            • New solution appears within seconds
            • Previous solution remains in history
          `,
          tips: 'Regenerate if solution doesn\'t fit your specific situation.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting Common Issues',
      sections: [
        {
          title: '🔐 Login Problems',
          content: `
            Problem: Can't log in
            Solutions:
            • Verify email and password are correct
            • Check CAPS LOCK is off
            • Clear browser cache and cookies
            • Try "Forgot Password" to reset
            • Ensure account is activated via email
            
            Still not working? Contact: support@agriassistify.ai
          `,
          tips: 'Use Chrome or Firefox for best experience.'
        },
        {
          title: '📝 Issue Submission Errors',
          content: `
            Problem: Can't submit issue
            Solutions:
            • Check all required fields are filled
            • Ensure description is at least 50 characters
            • Verify you're logged in
            • Check internet connection
            • Try refreshing the page
            • Clear form and re-enter data
          `,
          tips: 'Save your description in a text file before submitting.'
        },
        {
          title: '🤖 AI Not Responding',
          content: `
            Problem: AI solution not generated
            Solutions:
            • Wait 30 seconds - AI needs processing time
            • Check issue description is clear and detailed
            • Verify urgency level is set
            • Try regenerating AI solution
            • Check console for errors (F12 key)
            • Contact support if problem persists
          `,
          tips: 'Detailed descriptions help AI provide better solutions.'
        },
        {
          title: '📧 Not Receiving Notifications',
          content: `
            Problem: Missing email notifications
            Solutions:
            • Check spam/junk folder
            • Verify email address in profile
            • Enable notifications in settings
            • Whitelist: noreply@agriassistify.ai
            • Check email service provider settings
          `,
          tips: 'Add our email to contacts to avoid spam filters.'
        },
        {
          title: '🐌 Slow Performance',
          content: `
            Problem: Platform loading slowly
            Solutions:
            • Check internet connection speed
            • Close unnecessary browser tabs
            • Clear browser cache (Ctrl+Shift+Delete)
            • Update browser to latest version
            • Disable browser extensions
            • Try different browser
          `,
          tips: 'Minimum 2 Mbps internet speed recommended.'
        }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions',
      faqs: [
        {
          question: 'Is AgriAssistify.ai completely free for farmers?',
          answer: 'Yes! Basic issue reporting, AI analysis, and expert consultation are completely free for all farmers. Premium features like advanced analytics and bulk operations are available for a nominal fee.'
        },
        {
          question: 'How accurate is the AI diagnosis?',
          answer: 'Our AI powered by Google Gemini 2.5 Flash has an accuracy rate of 85-95% for common agricultural issues. For complex cases, we recommend consulting with agricultural experts. The AI provides evidence-based recommendations from verified agricultural research.'
        },
        {
          question: 'How long does it take to get AI recommendations?',
          answer: 'AI analysis typically takes 5-15 seconds. You\'ll receive instant recommendations including treatment plans, cost estimates, and prevention tips immediately after submitting your issue.'
        },
        {
          question: 'What types of agricultural issues can I report?',
          answer: 'You can report: Pest attacks (🐛), Plant diseases (🦠), Irrigation problems (💧), Equipment failures (🔧), Harvest issues (🌾), Soil problems, Fertilizer queries, Weather concerns, and other farm-related challenges.'
        },
        {
          question: 'How do I track the status of my reported issues?',
          answer: 'View all your issues on the Dashboard. Each ticket shows current status (Pending, In Progress, Resolved, Closed). You\'ll receive email notifications when status changes or when AI solutions are ready.'
        },
        {
          question: 'Can agricultural workers use this platform?',
          answer: 'Yes! Workers can create accounts, view assigned tasks, update issue status, and collaborate with farmers. They receive notifications for new assignments and can add resolution notes.'
        },
        {
          question: 'Is my farm data secure and private?',
          answer: 'Absolutely! We use industry-standard encryption (HTTPS, JWT tokens). Your farm data is never shared without permission. Only assigned workers and moderators can view your issues. We comply with data protection regulations.'
        },
        {
          question: 'What if the AI solution doesn\'t work?',
          answer: 'If the initial AI recommendation doesn\'t resolve your issue, you can: (1) Regenerate AI solution for alternative approaches, (2) Add comments with updates, (3) Contact our agricultural experts via phone/email, (4) Request field visit from assigned worker.'
        },
        {
          question: 'How are cost estimates calculated?',
          answer: 'AI provides cost estimates based on: Current market prices of pesticides/fertilizers in India, Average labor costs per acre, Treatment duration, Equipment rental (if needed). Prices are in INR and updated regularly but may vary by region.'
        },
        {
          question: 'Can I use AgriAssistify.ai offline?',
          answer: 'No, internet connection is required for AI analysis and real-time updates. However, you can prepare issue descriptions offline and submit when online. We\'re working on offline capabilities for future versions.'
        },
        {
          question: 'Do you support organic farming solutions?',
          answer: 'Yes! When reporting issues, you can specify preference for organic solutions. AI will prioritize recommendations like biopesticides, natural remedies, IPM (Integrated Pest Management), and sustainable practices.'
        },
        {
          question: 'How do I contact human agricultural experts?',
          answer: 'For urgent issues or complex problems: Phone: (+91) 9322545899 (24/7), Email: support@agriassistify.ai, Emergency Helpline: 1800-AGRI-HELP, Or use the Contact Us form on our website.'
        },
        {
          question: 'What crops does AgriAssistify.ai support?',
          answer: 'We support all major crops including: Cotton, Rice, Wheat, Sugarcane, Pulses, Vegetables, Fruits, Spices, Oilseeds, and more. AI has knowledge of India-specific crop varieties and regional farming practices.'
        }
      ]
    }
  };

  // ==================== RENDER CONTENT ====================
  const renderContent = () => {
    const content = documentation[activeCategory];
    
    if (activeCategory === 'faq') {
      return (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h2>
          <div className="space-y-4">
            {content.faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <span className="text-green-600 flex-shrink-0 text-2xl">
                    {expandedFaq === index ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="p-4 pt-0 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h2>
        <div className="space-y-8">
          {content.sections.map((section, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">
                {section.content}
              </div>
              {section.tips && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">💡 Pro Tip: </span>
                    {section.tips}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">📚 Help & Documentation</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Comprehensive guides, tutorials, and support resources to help you make the most of AgriAssistify.ai
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📑 Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeCategory === category.id
                        ? 'bg-green-100 text-green-800 font-medium border-l-4 border-green-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Contact */}
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Need More Help?</h4>
                <p className="text-sm text-green-700 mb-3">Our support team is here for you</p>
                <Link
                  to="/contact"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpDocs;
