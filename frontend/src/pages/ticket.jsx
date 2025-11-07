/**
 * TICKET.JSX - AgriAssistify.ai Single Ticket Details with AI Integration
 * Enhanced with Gemini AI Analysis Display
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TicketDetailsPage() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch ticket details
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchTicketDetails();
    
    // Auto-refresh if analyzing
    const interval = setInterval(() => {
      if (ticket?.status === 'analyzing') {
        fetchTicketDetails();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, token, ticket?.status]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setTicket(data.ticket);
      } else {
        setError(data.error || data.message || "Failed to fetch ticket details");
      }
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate AI solution
  const handleRegenerateAI = async () => {
    if (!confirm('Regenerate AI solution? This will replace the current analysis.')) {
      return;
    }

    setRegenerating(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tickets/${id}/regenerate-ai`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setTicket(data.ticket);
        alert('AI solution regenerated successfully!');
      } else {
        alert(data.error || 'Failed to regenerate AI solution');
      }
    } catch (err) {
      console.error('Regenerate AI error:', err);
      alert('Network error. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIssueTypeIcon = (issueType) => {
    switch (issueType) {
      case 'pest-attack': return '🐛';
      case 'irrigation': return '💧';
      case 'equipment': return '🔧';
      case 'disease': return '🦠';
      case 'harvest': return '🌾';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading ticket details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">❌ {error}</p>
            <button
              onClick={() => navigate('/tickets')}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Tickets
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/tickets" className="hover:text-green-600">Farm Tickets</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Ticket Details</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getIssueTypeIcon(ticket.issueType)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <p className="text-gray-600">Ticket ID: {ticket._id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getPriorityColor(ticket.priority || ticket.urgencyLevel)}`}>
                {(ticket.priority || ticket.urgencyLevel).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h2>
              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>

            {/* AI Analysis Status */}
            {ticket.status === 'analyzing' && !ticket.aiSolution?.isGenerated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-yellow-900">🤖 AI is analyzing your issue...</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      This usually takes 5-10 seconds. The page will update automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Solution Display */}
            {ticket.aiSolution?.isGenerated && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                
                {/* AI Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="text-4xl mr-3">🤖</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">AI-Generated Solution</h2>
                      <p className="text-sm text-gray-600">Powered by Google Gemini AI</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {ticket.aiSolution.confidence > 0 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {ticket.aiSolution.confidence}% Confidence
                      </span>
                    )}
                    <button
                      onClick={handleRegenerateAI}
                      disabled={regenerating}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        regenerating
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {regenerating ? 'Regenerating...' : '🔄 Regenerate'}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                {ticket.aiSolution.summary && (
                  <div className="bg-white rounded-lg p-5 mb-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">📋</span>
                      Summary
                    </h3>
                    <p className="text-gray-700">{ticket.aiSolution.summary}</p>
                  </div>
                )}

                {/* Main Solution */}
                <div className="bg-white rounded-lg p-5 mb-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-xl mr-2">💡</span>
                    Solution
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {ticket.aiSolution.solution || ticket.aiSolution.helpfulNotes}
                  </p>
                </div>

                {/* Recommendations */}
                {ticket.aiSolution.recommendations && ticket.aiSolution.recommendations.length > 0 && (
                  <div className="bg-white rounded-lg p-5 mb-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">✅</span>
                      Step-by-Step Recommendations
                    </h3>
                    <ol className="space-y-3">
                      {ticket.aiSolution.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 flex-1">{rec}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Possible Causes */}
                {ticket.aiSolution.possibleCauses && ticket.aiSolution.possibleCauses.length > 0 && (
                  <div className="bg-white rounded-lg p-5 mb-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🔍</span>
                      Possible Causes
                    </h3>
                    <ul className="space-y-2">
                      {ticket.aiSolution.possibleCauses.map((cause, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700">{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prevention Tips */}
                {ticket.aiSolution.preventionTips && ticket.aiSolution.preventionTips.length > 0 && (
                  <div className="bg-white rounded-lg p-5 mb-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🛡️</span>
                      Prevention Tips
                    </h3>
                    <ul className="space-y-2">
                      {ticket.aiSolution.preventionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timeline & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticket.aiSolution.urgencyAssessment && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Urgency Assessment</p>
                      <p className={`text-lg font-bold ${getPriorityColor(ticket.aiSolution.urgencyAssessment).split(' ')[1]}`}>
                        {ticket.aiSolution.urgencyAssessment.toUpperCase()}
                      </p>
                    </div>
                  )}
                  
                  {ticket.aiSolution.estimatedResolutionTime && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Estimated Resolution Time</p>
                      <p className="text-lg font-bold text-blue-600">
                        {ticket.aiSolution.estimatedResolutionTime}
                      </p>
                    </div>
                  )}
                </div>

                {/* Required Skills */}
                {ticket.aiSolution.relatedSkills && ticket.aiSolution.relatedSkills.length > 0 && (
                  <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.aiSolution.relatedSkills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4">
                  AI solution generated on {new Date(ticket.aiSolution.generatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Ticket Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Issue Type</label>
                  <p className="text-gray-900 capitalize flex items-center">
                    {getIssueTypeIcon(ticket.issueType)} {ticket.issueType.replace('-', ' ')}
                  </p>
                </div>
                
                {ticket.fieldLocation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Field Location</label>
                    <p className="text-gray-900">📍 {ticket.fieldLocation}</p>
                  </div>
                )}
                
                {ticket.affectedCrop && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Affected Crop</label>
                    <p className="text-gray-900">🌱 {ticket.affectedCrop}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Urgency Level</label>
                  <p className="text-gray-900 capitalize">⚡ {ticket.urgencyLevel}</p>
                </div>
                
                {ticket.estimatedImpact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Estimated Impact</label>
                    <p className="text-gray-900">📊 {ticket.estimatedImpact}</p>
                  </div>
                )}
              </div>
            </div>

            {/* People Involved */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">People Involved</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Reported By</label>
                  {ticket.reportedBy && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">
                          {ticket.reportedBy.name ? ticket.reportedBy.name[0].toUpperCase() : ticket.reportedBy.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {ticket.reportedBy.name || ticket.reportedBy.email}
                        </p>
                        <p className="text-gray-600 text-sm capitalize">🌱 {ticket.reportedBy.role}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Assigned To</label>
                  {ticket.assignedTo ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {ticket.assignedTo.name ? ticket.assignedTo.name[0].toUpperCase() : ticket.assignedTo.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {ticket.assignedTo.name || ticket.assignedTo.email}
                        </p>
                        <p className="text-gray-600 text-sm capitalize">🔧 {ticket.assignedTo.role}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mt-1">⏳ Not yet assigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900 text-sm">
                    {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900 text-sm">
                    {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
