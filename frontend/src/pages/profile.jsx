/**
 * PROFILE.JSX - AgriAssistify.ai User Profile Management
 * 
 * Comprehensive profile page for the Intelligent Agriculture Issue Tracker
 * Features role-based information, agricultural skills management, and account settings
 * Designed for farmers, workers, moderators, and admins
 */

// ==================== IMPORTS ====================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ==================== PROFILE COMPONENT ====================
export default function Profile() {
  // ==================== STATE MANAGEMENT ====================
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    farmSize: "",
    cropTypes: [],
    yearsExperience: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ==================== AGRICULTURE SKILLS OPTIONS ====================
  const skillOptions = [
    'pest-control', 'irrigation', 'machinery-repair', 'crop-management',
    'soil-analysis', 'harvest', 'livestock', 'greenhouse', 'organic-farming',
    'fertilizer-management', 'plant-disease', 'equipment-maintenance',
    'precision-agriculture', 'sustainable-farming', 'hydroponics'
  ];

  // ==================== COMMON CROP TYPES ====================
  const cropTypeOptions = [
    'Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Tomatoes',
    'Potatoes', 'Onions', 'Carrots', 'Lettuce', 'Peppers', 'Cucumbers',
    'Apples', 'Oranges', 'Grapes', 'Strawberries', 'Other'
  ];

  // ==================== INITIALIZE USER DATA ====================
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        location: parsedUser.location || "",
        bio: parsedUser.bio || "",
        skills: parsedUser.skills || [],
        farmSize: parsedUser.farmSize || "",
        cropTypes: parsedUser.cropTypes || [],
        yearsExperience: parsedUser.yearsExperience || ""
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // ==================== FORM HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleCropTypeToggle = (cropType) => {
    const updatedCropTypes = formData.cropTypes.includes(cropType)
      ? formData.cropTypes.filter(c => c !== cropType)
      : [...formData.cropTypes, cropType];
    
    setFormData({ ...formData, cropTypes: updatedCropTypes });
  };

  // ==================== UPDATE PROFILE ====================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== GET ROLE BADGE COLOR ====================
  const getRoleBadgeColor = (role) => {
    const colors = {
      farmer: 'bg-green-100 text-green-800',
      worker: 'bg-blue-100 text-blue-800',
      moderator: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // ==================== GET ROLE ICON ====================
  const getRoleIcon = (role) => {
    const icons = {
      farmer: '🌱',
      worker: '🔧',
      moderator: '👨‍🌾',
      admin: '👑'
    };
    return icons[role] || '👤';
  };

  // ==================== RENDER LOADING STATE ====================
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER PROFILE PAGE ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* ==================== SUCCESS/ERROR MESSAGES ==================== */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ==================== PROFILE HEADER ==================== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || user.email}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isEditing 
                  ? 'bg-gray-300 hover:bg-gray-400 text-gray-700' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        {/* ==================== TABS ==================== */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👤 Profile Information
              </button>
              
              {(user.role === 'farmer' || user.role === 'worker') && (
                <button
                  onClick={() => setActiveTab('agricultural')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'agricultural'
                      ? 'border-green-500 text-black-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🌾 Agricultural Info
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ Account Settings
              </button>
            </nav>
          </div>

          {/* ==================== TAB CONTENT ==================== */}
          <div className="p-6">
            
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.name || "Not specified"}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900 py-2">{user.email}</p>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.phone || "Not specified"}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="City, State, Country"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.location || "Not specified"}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tell us about yourself and your agricultural background..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.bio || "No bio provided"}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Agricultural Information Tab */}
            {/* Agricultural Information Tab */}
{activeTab === 'agricultural' && (user.role === 'farmer' || user.role === 'worker') && (
  <form onSubmit={handleUpdateProfile}>
    <div className="space-y-6">
      
      {/* Agricultural Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Agricultural Skills & Expertise
        </label>
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skillOptions.map(skill => (
              <label 
                key={skill} 
                className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 font-medium capitalize">
                  {skill.replace(/-/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(user.skills || []).length > 0 ? (
              user.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">
                  {skill.replace(/-/g, ' ')}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills specified</p>
            )}
          </div>
        )}
      </div>

      {/* Farm-specific fields for farmers */}
      {user.role === 'farmer' && (
        <>
          {/* Farm Size and Years Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Size
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., 50 acres, 20 hectares"
                />
              ) : (
                <p className="text-gray-900 py-2">{user.farmSize || "Not specified"}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Years in agriculture"
                  min="0"
                  max="100"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user.yearsExperience ? `${user.yearsExperience} years` : "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* Crop Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Primary Crops (Select multiple)
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                {cropTypeOptions.map(cropType => (
                  <label 
                    key={cropType} 
                    className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.cropTypes.includes(cropType)}
                      onChange={() => handleCropTypeToggle(cropType)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {cropType}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(user.cropTypes || []).length > 0 ? (
                  user.cropTypes.map(cropType => (
                    <span key={cropType} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      🌱 {cropType}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No crop types specified</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>

    {isEditing && (
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
          }`}
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Saving...</span>
            </span>
          ) : (
            '💾 Save Agricultural Info'
          )}
        </button>
      </div>
    )}
  </form>
)}


            {/* Account Settings Tab */}
{activeTab === 'settings' && (
  <div className="space-y-6">
    
    {/* Account Information */}
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Account Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
          <p className="text-base font-semibold text-gray-900 capitalize">
            {user.role || 'Farmer'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
          <p className="text-base font-semibold text-gray-900">
            {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
          <p className="text-xs font-mono font-semibold text-gray-700 bg-gray-200 px-3 py-2 rounded border border-gray-300 break-all">
            {user._id || user.id || 'N/A'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Account Status</label>
          <p className="text-base font-semibold text-green-600 flex items-center space-x-2">
            <span>✅</span>
            <span>Active</span>
          </p>
        </div>
      </div>
    </div>

    {/* Danger Zone */}
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center space-x-2">
        <span>⚠️</span>
        <span>Danger Zone</span>
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-red-200">
          <div className="flex-1">
            <p className="text-base font-semibold text-red-900">Change Password</p>
            <p className="text-sm text-red-700">Update your account password</p>
          </div>
          <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md whitespace-nowrap">
            Change Password
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
          <div className="flex-1">
            <p className="text-base font-semibold text-red-900">Delete Account</p>
            <p className="text-sm text-red-700">Permanently delete your AgriAssistify.ai account</p>
          </div>
          <button className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition-colors shadow-md whitespace-nowrap">
            Delete Account
          </button>
        </div>
      </div>
    </div>

    {/* Privacy Settings */}
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
        <span>🔒</span>
        <span>Privacy & Notifications</span>
      </h3>
      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
          <input 
            type="checkbox" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
            defaultChecked 
          />
          <span className="text-sm font-medium text-blue-900">
            Email notifications for ticket updates
          </span>
        </label>
        
        <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
          <input 
            type="checkbox" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
            defaultChecked 
          />
          <span className="text-sm font-medium text-blue-900">
            SMS notifications for urgent issues
          </span>
        </label>
        
        <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
          <input 
            type="checkbox" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <span className="text-sm font-medium text-blue-900">
            Share profile with other farmers
          </span>
        </label>
      </div>
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
