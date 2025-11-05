/**
 * DASHBOARD.JSX - AgriAssistify.ai Intelligent Dashboard
 * 
 * Role-based dashboard for the Intelligent Agriculture Issue Tracker
 * Features analytics, statistics, and personalized views for different user roles
 * Designed for farmers, workers, moderators, and admins
 */

// ==================== IMPORTS ====================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ==================== DASHBOARD COMPONENT ====================
export default function Dashboard() {
  // ==================== STATE MANAGEMENT ====================
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    tickets: [],
    stats: {
      totalTickets: 0,
      pendingTickets: 0,
      inProgressTickets: 0,
      resolvedTickets: 0,
      myTickets: 0,
      assignedToMe: 0
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==================== USER DATA INITIALIZATION ====================
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ==================== FETCH DASHBOARD DATA ====================
  useEffect(() => {
    if (token && user) {
      fetchDashboardData();
    }
  }, [token, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tickets`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const tickets = data.tickets || [];
        
        // Calculate statistics
        const stats = {
          totalTickets: tickets.length,
          pendingTickets: tickets.filter(t => t.status === 'PENDING').length,
          inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
          resolvedTickets: tickets.filter(t => t.status === 'RESOLVED').length,
          myTickets: user.role === 'farmer' 
            ? tickets.filter(t => t.createdBy?._id === user.id || t.createdBy?._id === user._id).length
            : tickets.length,
          assignedToMe: user.role === 'worker' || user.role === 'moderator'
            ? tickets.filter(t => t.assignedTo?._id === user.id || t.assignedTo?._id === user._id).length
            : 0
        };
        
        setDashboardData({
          tickets: tickets.slice(0, 5), // Recent tickets
          stats,
          recentActivity: generateRecentActivity(tickets.slice(0, 3))
        });
      } else {
        setError(data.error || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== GENERATE RECENT ACTIVITY ====================
  const generateRecentActivity = (tickets) => {
    return tickets.map(ticket => ({
      id: ticket._id,
      title: ticket.title,
      type: ticket.issueType,
      action: getLatestAction(ticket),
      time: ticket.updatedAt || ticket.createdAt,
      status: ticket.status
    }));
  };

  const getLatestAction = (ticket) => {
    if (ticket.status === 'RESOLVED') return 'was resolved';
    if (ticket.status === 'IN_PROGRESS') return 'is being worked on';
    if (ticket.assignedTo) return 'was assigned';
    return 'was reported';
  };

  // ==================== UTILITY FUNCTIONS ====================
  const getIssueTypeIcon = (issueType) => {
    const icons = {
      pest: '🐛',
      irrigation: '💧',
      equipment: '🔧',
      disease: '🦠',
      harvest: '🌾',
      other: '📋'
    };
    return icons[issueType] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-200',
      'RESOLVED': 'bg-green-100 text-green-800 border-green-200',
      'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleSpecificGreeting = () => {
    const greetings = {
      farmer: "Welcome back! Keep track of your farm issues and their resolution progress.",
      worker: "Ready to help solve agricultural problems? Check your assigned tasks.",
      moderator: "Oversee farm operations and ensure efficient issue resolution.",
      admin: "Monitor the entire AgriAssistify.ai platform and user activity."
    };
    return greetings[user?.role] || "Welcome to AgriAssistify.ai!";
  };

  // ==================== RENDER LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
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
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">❌ {error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER DASHBOARD ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* ==================== HEADER ==================== */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <span>🌾</span>
                <span>Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-2">
                {user ? `${getRoleSpecificGreeting()}` : "Welcome to the intelligent agriculture platform!"}
              </p>
            </div>
            
            {/* Quick Action Button */}
            {user && user.role === 'farmer' && (
              <Link
                to="/tickets"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>📝</span>
                <span>Report Issue</span>
              </Link>
            )}
          </div>
        </div>

        {/* ==================== STATISTICS CARDS ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'farmer' ? 'My Issues' : 'Total Issues'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.myTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {user?.role === 'farmer' ? 'Farm issues you\'ve reported' : 'All farm issues in system'}
            </p>
          </div>

          {/* Pending Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Issues</p>
                <p className="text-3xl font-bold text-yellow-600">{dashboardData.stats.pendingTickets}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Awaiting AI analysis & assignment</p>
          </div>

          {/* In Progress Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'worker' || user?.role === 'moderator' ? 'Assigned to Me' : 'In Progress'}
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {user?.role === 'worker' || user?.role === 'moderator' 
                    ? dashboardData.stats.assignedToMe 
                    : dashboardData.stats.inProgressTickets}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {user?.role === 'worker' || user?.role === 'moderator' 
                ? 'Issues assigned to you' 
                : 'Currently being resolved'}
            </p>
          </div>

          {/* Resolved Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Issues</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.stats.resolvedTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Successfully completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ==================== RECENT ISSUES ==================== */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Farm Issues</h3>
              <Link 
                to="/tickets" 
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {dashboardData.tickets.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🌱</span>
                <p className="text-gray-500">No farm issues yet</p>
                <p className="text-gray-400 text-sm">Issues will appear here when reported</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.tickets.map((ticket) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <span className="text-xl">{getIssueTypeIcon(ticket.issueType)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-green-600 truncate">
                        {ticket.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{ticket.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ==================== RECENT ACTIVITY ==================== */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            
            {dashboardData.recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📈</span>
                <p className="text-gray-500">No recent activity</p>
                <p className="text-gray-400 text-sm">Activity will appear here as issues are processed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-lg">{getIssueTypeIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.title}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.time).toLocaleDateString()} at{' '}
                        {new Date(activity.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================== QUICK ACTIONS SECTION ==================== */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Role-specific quick actions */}
            {user?.role === 'farmer' && (
              <>
                <Link
                  to="/tickets"
                  className="bg-white hover:bg-green-50 p-4 rounded-lg text-center transition-colors group border border-green-200"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📝</span>
                  <span className="text-sm font-medium text-gray-700">Report Issue</span>
                </Link>
                
                <Link
                  to="/tickets"
                  className="bg-white hover:bg-blue-50 p-4 rounded-lg text-center transition-colors group border border-blue-200"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📋</span>
                  <span className="text-sm font-medium text-gray-700">My Issues</span>
                </Link>
              </>
            )}
            
            {(user?.role === 'worker' || user?.role === 'moderator') && (
              <>
                <Link
                  to="/tickets"
                  className="bg-white hover:bg-blue-50 p-4 rounded-lg text-center transition-colors group border border-blue-200"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🔧</span>
                  <span className="text-sm font-medium text-gray-700">Assigned Tasks</span>
                </Link>
                
                <Link
                  to="/tickets"
                  className="bg-white hover:bg-purple-50 p-4 rounded-lg text-center transition-colors group border border-purple-200"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👥</span>
                  <span className="text-sm font-medium text-gray-700">All Issues</span>
                </Link>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className="bg-white hover:bg-red-50 p-4 rounded-lg text-center transition-colors group border border-red-200"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👑</span>
                  <span className="text-sm font-medium text-gray-700">Admin Panel</span>
                </Link>
                
                <Link
                  to="/tickets"
                  className="bg-white hover:bg-green-50 p-4 rounded-lg text-center transition-colors group border border-green-200"
                >
                  <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📊</span>
                  <span className="text-sm font-medium text-gray-700">Analytics</span>
                </Link>
              </>
            )}
            
            {/* Common quick actions for all users */}
            <Link
              to="/profile"
              className="bg-white hover:bg-gray-50 p-4 rounded-lg text-center transition-colors group border border-gray-200"
            >
              <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👤</span>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </Link>
            
            <button
              onClick={() => window.open('https://docs.agriassistify.ai', '_blank')}
              className="bg-white hover:bg-yellow-50 p-4 rounded-lg text-center transition-colors group border border-yellow-200"
            >
              <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📚</span>
              <span className="text-sm font-medium text-gray-700">Help & Docs</span>
            </button>
          </div>
        </div>

        {/* ==================== AI INSIGHTS SECTION ==================== */}
        {dashboardData.stats.totalTickets > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>🤖</span>
              <span>AI Insights</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">System Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resolution Rate</span>
                    <span className="text-sm font-medium">
                      {dashboardData.stats.totalTickets > 0 
                        ? Math.round((dashboardData.stats.resolvedTickets / dashboardData.stats.totalTickets) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${dashboardData.stats.totalTickets > 0 
                          ? (dashboardData.stats.resolvedTickets / dashboardData.stats.totalTickets) * 100
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {dashboardData.stats.pendingTickets > 3 && (
                    <li>• Consider adding more agricultural workers</li>
                  )}
                  {dashboardData.stats.resolvedTickets > dashboardData.stats.totalTickets * 0.8 && (
                    <li>• Excellent resolution rate! 🎉</li>
                  )}
                  <li>• Regular preventive measures can reduce issues</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
