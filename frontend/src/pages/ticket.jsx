/**
 * TICKET.JSX - AgriAssistify.ai Single Ticket Details
 * 
 * Displays detailed information about a single farm issue ticket
 * Shows AI analysis results, assigned workers, and ticket status
 * Role-based access control for farmers, workers, moderators, and admins
 */

// ==================== IMPORTS ====================
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ==================== TICKET DETAILS COMPONENT ====================
export default function TicketDetailsPage() {
  // ==================== STATE MANAGEMENT ====================
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  // ==================== FETCH USER DATA ====================
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ==================== FETCH TICKET DETAILS ====================
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchTicketDetails();
  }, [id, token]);

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

  // ==================== GET STATUS COLOR ====================
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ==================== GET PRIORITY COLOR ====================
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ==================== GET ISSUE TYPE ICON ====================
  const getIssueTypeIcon = (issueType) => {
    switch (issueType) {
      case 'pest': return '🐛';
      case 'irrigation': return '💧';
      case 'equipment': return '🔧';
      case 'disease': return '🦠';
      case 'harvest': return '🌾';
      default: return '📋';
    }
  };

  // ==================== RENDER LOADING STATE ====================
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

  // ==================== RENDER ERROR STATE ====================
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

  // ==================== RENDER TICKET DETAILS ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* ==================== HEADER ==================== */}
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
                <p className="text-gray-600">Ticket ID: {ticket.id}</p>
              </div>
            </div>
            
            {/* Status and Priority Badges */}
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority} Priority
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==================== MAIN CONTENT ==================== */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h2>
              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>

            {/* AI Analysis Results */}
            {ticket.aiAnalysis && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 border border-green-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  🤖 AI Analysis Results
                </h2>
                
                {ticket.aiAnalysis.helpfulNotes && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Recommendations:</h3>
                    <p className="text-gray-700 bg-white rounded p-3 border">
                      {ticket.aiAnalysis.helpfulNotes}
                    </p>
                  </div>
                )}

                {ticket.aiAnalysis.relatedSkills && ticket.aiAnalysis.relatedSkills.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Required Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {ticket.aiAnalysis.relatedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Updates/Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Updates & Communication</h2>
              <div className="text-center py-8 text-gray-500">
                <p>💬 No updates yet</p>
                <p className="text-sm mt-2">Updates and communications will appear here</p>
              </div>
            </div>
          </div>

          {/* ==================== SIDEBAR ==================== */}
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
                
                {ticket.cropType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Affected Crop</label>
                    <p className="text-gray-900">🌱 {ticket.cropType}</p>
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
                {/* Reported By */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Reported By</label>
                  {ticket.createdBy && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">
                          {ticket.createdBy.name ? ticket.createdBy.name[0].toUpperCase() : ticket.createdBy.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {ticket.createdBy.name || ticket.createdBy.email}
                        </p>
                        <p className="text-gray-600 text-sm capitalize">🌱 {ticket.createdBy.role}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assigned To */}
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
                        {ticket.assignedTo.skills && ticket.assignedTo.skills.length > 0 && (
                          <p className="text-gray-500 text-xs">
                            Skills: {ticket.assignedTo.skills.join(', ')}
                          </p>
                        )}
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

            {/* Actions */}
            {user && (user.role === 'worker' || user.role === 'moderator' || user.role === 'admin') && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    🔄 Update Status
                  </button>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    💬 Add Comment
                  </button>
                  
                  {user.role === 'moderator' || user.role === 'admin' ? (
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                      👤 Reassign
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
