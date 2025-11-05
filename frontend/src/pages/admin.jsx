/**
 * ADMIN.JSX - AgriAssistify.ai Admin Panel
 * 
 * Admin dashboard for managing users in the Intelligent Agriculture Issue Tracker
 * Allows admins to update user roles and agricultural skills
 * Features search, filtering, and role-based management for farming operations
 */

// ==================== IMPORTS ====================
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ==================== ADMIN PANEL COMPONENT ====================
export default function AdminPanel() {
  // ==================== STATE MANAGEMENT ====================
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // ==================== AGRICULTURE SKILLS OPTIONS ====================
  const skillOptions = [
    'pest-control', 'irrigation', 'machinery-repair', 'crop-management',
    'soil-analysis', 'harvest', 'livestock', 'greenhouse', 'organic-farming',
    'fertilizer-management', 'plant-disease', 'equipment-maintenance'
  ];

  // ==================== FETCH USERS ON MOUNT ====================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== FETCH USERS FUNCTION ====================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      // FIX: Corrected API endpoint to match your backend
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUsers(data.users || data); // Handle different response structures
        setFilteredUsers(data.users || data);
      } else {
        setError(data.error || data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE EDIT CLICK ====================
  const handleEditClick = (user) => {
    setEditingUser(user._id); // FIX: Use user._id instead of email
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "",
    });
    setError("");
    setSuccess("");
  };

  // ==================== HANDLE UPDATE ====================
  const handleUpdate = async () => {
    try {
      setError("");
      
      // FIX: Corrected API endpoint and data structure
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/update-user`,
        {
          method: "PUT", // FIX: Changed from POST to PUT for updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: editingUser, // FIX: Send user ID instead of email
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      
      if (res.ok) {
        setSuccess("User updated successfully!");
        setEditingUser(null);
        setFormData({ role: "", skills: "" });
        fetchUsers(); // Refresh the user list
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || data.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Network error. Please try again.");
    }
  };

  // ==================== HANDLE SEARCH ====================
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    setFilteredUsers(
      users.filter((user) => 
        user.email.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
    );
  };

  // ==================== HANDLE ROLE FILTER ====================
  const handleRoleFilter = (role) => {
    if (role === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === role));
    }
  };

  // ==================== RENDER COMPONENT ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* ==================== HEADER ==================== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌾 AgriAssistify.ai Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage users and their agricultural roles in the intelligent farming system
          </p>
        </div>

        {/* ==================== SUCCESS/ERROR MESSAGES ==================== */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* ==================== SEARCH AND FILTERS ==================== */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <input
                id="search"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Search by email, name, or role..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleRoleFilter("all")}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm transition-colors"
                >
                  All
                </button>
                <button
                  onClick={() => handleRoleFilter("farmer")}
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-sm transition-colors"
                >
                  🌱 Farmers
                </button>
                <button
                  onClick={() => handleRoleFilter("worker")}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm transition-colors"
                >
                  🔧 Workers
                </button>
                <button
                  onClick={() => handleRoleFilter("moderator")}
                  className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full text-sm transition-colors"
                >
                  👨‍🌾 Moderators
                </button>
                <button
                  onClick={() => handleRoleFilter("admin")}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-full text-sm transition-colors"
                >
                  👑 Admins
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== LOADING STATE ==================== */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          /* ==================== USERS LIST ==================== */
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No users found matching your search criteria.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Information */}
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">
                            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.name || "No name provided"}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Current Role:</span>{" "}
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'farmer' ? 'bg-green-100 text-green-800' :
                            user.role === 'worker' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'moderator' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </p>
                        
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">Agricultural Skills:</span>{" "}
                          <span className="text-gray-600">
                            {user.skills && user.skills.length > 0
                              ? user.skills.join(", ")
                              : "No skills specified"}
                          </span>
                        </p>
                        
                        <p className="text-sm text-gray-500">
                          Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Edit Form or Edit Button */}
                    <div className="flex flex-col justify-center">
                      {editingUser === user._id ? (
                        <div className="space-y-4">
                          {/* Role Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={formData.role}
                              onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value })
                              }
                            >
                              <option value="farmer">🌱 Farmer</option>
                              <option value="worker">🔧 Agricultural Worker</option>
                              <option value="moderator">👨‍🌾 Farm Moderator</option>
                              <option value="admin">👑 System Admin</option>
                            </select>
                          </div>

                          {/* Skills Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Agricultural Skills (comma-separated)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., pest-control, irrigation, crop-management"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={formData.skills}
                              onChange={(e) =>
                                setFormData({ ...formData, skills: e.target.value })
                              }
                            />
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">Suggested skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {skillOptions.map(skill => (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={() => {
                                      const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
                                      if (!currentSkills.includes(skill)) {
                                        setFormData({ 
                                          ...formData, 
                                          skills: currentSkills.length > 0 ? `${formData.skills}, ${skill}` : skill
                                        });
                                      }
                                    }}
                                    className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-xs transition-colors"
                                  >
                                    + {skill}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <button
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              onClick={handleUpdate}
                            >
                              💾 Save Changes
                            </button>
                            <button
                              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                              onClick={() => {
                                setEditingUser(null);
                                setFormData({ role: "", skills: "" });
                                setError("");
                              }}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                          onClick={() => handleEditClick(user)}
                        >
                          ✏️ Edit User
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== STATISTICS ==================== */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'farmer').length}</div>
            <div className="text-sm text-gray-600">Farmers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'worker').length}</div>
            <div className="text-sm text-gray-600">Workers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'moderator').length}</div>
            <div className="text-sm text-gray-600">Moderators</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
