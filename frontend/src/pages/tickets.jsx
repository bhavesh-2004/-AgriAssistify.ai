/**
 * TICKETS.JSX - AgriAssistify.ai Farm Issues Dashboard
 * Enhanced with AI Integration Status
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Tickets() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    issueType: "pest-attack",
    urgencyLevel: "medium",
    fieldLocation: "",
    affectedCrop: "",
    estimatedImpact: ""
  });
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTickets, setFetchingTickets] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const token = localStorage.getItem("token");

  const issueTypes = [
    { value: "pest-attack", label: "🐛 Pest Attack", description: "Insects, worms, or pests affecting crops" },
    { value: "irrigation", label: "💧 Irrigation Issues", description: "Water supply or irrigation system problems" },
    { value: "equipment", label: "🔧 Equipment Problems", description: "Machinery or equipment failures" },
    { value: "disease", label: "🦠 Plant Disease", description: "Crop diseases or infections" },
    { value: "harvest", label: "🌾 Harvest Issues", description: "Harvesting problems or concerns" },
    { value: "other", label: "📋 Other Issues", description: "Other agricultural problems" }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchTickets = async () => {
    try {
      setFetchingTickets(true);
      setError("");
      
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: "GET",
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        setError(data.error || "Failed to fetch tickets");
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setFetchingTickets(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTickets();
      
      // Auto-refresh every 10 seconds to catch new AI solutions
      const interval = setInterval(fetchTickets, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setError("Issue title is required");
      return false;
    }
    if (!form.description.trim()) {
      setError("Issue description is required");
      return false;
    }
    if (form.description.length < 20) {
      setError("Please provide more detailed description (at least 20 characters)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({
          title: "",
          description: "",
          issueType: "pest-attack",
          urgencyLevel: "medium",
          fieldLocation: "",
          affectedCrop: "",
          estimatedImpact: ""
        });
        setSuccess("Farm issue reported successfully! 🌾 AI is analyzing...");
        setShowCreateForm(false);
        fetchTickets();
        
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || data.message || "Ticket creation failed");
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
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

  const getIssueTypeIcon = (issueType) => {
    const type = issueTypes.find(t => t.value === issueType);
    return type ? type.label.split(' ')[0] : '📋';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🌾 Farm Issues
              </h1>
              <p className="text-gray-600 mt-2">
                Intelligent agriculture issue tracking with AI analysis
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg"
              >
                <span>{showCreateForm ? '❌' : '📝'}</span>
                <span>{showCreateForm ? 'Cancel' : 'Report New Issue'}</span>
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Create Form - Same as before */}
        {showCreateForm && user && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <span>🌱</span>
              <span>Report New Farm Issue</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Brief description of the farm issue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="issueType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Type *
                  </label>
                  <select
                    id="issueType"
                    name="issueType"
                    value={form.issueType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    {issueTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="urgencyLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    id="urgencyLevel"
                    name="urgencyLevel"
                    value={form.urgencyLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="low">🟢 Low - Can wait a few days</option>
                    <option value="medium">🟡 Medium - Needs attention soon</option>
                    <option value="high">🔴 High - Urgent, needs immediate attention</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fieldLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                    Field Location
                  </label>
                  <input
                    type="text"
                    id="fieldLocation"
                    name="fieldLocation"
                    value={form.fieldLocation}
                    onChange={handleChange}
                    placeholder="e.g., North Field, Section A3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="affectedCrop" className="block text-sm font-semibold text-gray-700 mb-2">
                    Affected Crop
                  </label>
                  <input
                    type="text"
                    id="affectedCrop"
                    name="affectedCrop"
                    value={form.affectedCrop}
                    onChange={handleChange}
                    placeholder="e.g., Wheat (Winter variety)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Please provide detailed information about the issue, symptoms, when it started, affected area size, etc. (Minimum 20 characters)"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {form.description.length}/20 characters minimum for AI analysis
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="estimatedImpact" className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Impact
                  </label>
                  <input
                    type="text"
                    id="estimatedImpact"
                    name="estimatedImpact"
                    value={form.estimatedImpact}
                    onChange={handleChange}
                    placeholder="e.g., 30-40% yield loss potential, 5 acres affected"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span>🚀</span>
                      <span>Submit Farm Issue</span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {user && user.role === 'farmer' ? 'My Farm Issues' : 'All Farm Issues'}
            </h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              {tickets.length} issue{tickets.length !== 1 ? 's' : ''}
            </span>
          </div>

          {fetchingTickets ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading farm issues...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {tickets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-gray-600 text-xl font-semibold mb-2">No farm issues reported yet</p>
                  <p className="text-gray-400">
                    {user && user.role === 'farmer' 
                      ? "Click 'Report New Issue' button to get started" 
                      : "No issues have been reported by farmers yet"}
                  </p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-green-400 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-3xl">{getIssueTypeIcon(ticket.issueType)}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 hover:text-green-600 transition-colors mb-1">
                            {ticket.title}
                          </h3>
                          <p className="text-gray-500 text-sm capitalize">
                            {ticket.issueType.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        {ticket.urgencyLevel && (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            ticket.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
                            ticket.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {ticket.urgencyLevel.toUpperCase()}
                          </span>
                        )}
                        {/* AI Status Badge */}
                        {ticket.aiSolution?.isGenerated && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                            🤖 AI
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        {ticket.fieldLocation && (
                          <span className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>{ticket.fieldLocation}</span>
                          </span>
                        )}
                        {ticket.affectedCrop && (
                          <span className="flex items-center space-x-1">
                            <span>🌱</span>
                            <span>{ticket.affectedCrop}</span>
                          </span>
                        )}
                      </div>
                      <span className="font-medium">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
