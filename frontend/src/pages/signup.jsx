/**
 * SIGNUP.JSX - AgriAssistify.ai User Registration
 * 
 * Professional signup form for the Intelligent Agriculture Issue Tracker
 * Features role selection, agricultural skills, and comprehensive validation
 * Designed specifically for farmers, workers, moderators joining the platform
 */

// ==================== IMPORTS ====================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
 

// ==================== SIGNUP COMPONENT ====================
export default function SignupPage() {
  // ==================== STATE MANAGEMENT ====================
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // ==================== AGRICULTURE SKILLS OPTIONS ====================
  const skillOptions = [
    'pest-control', 'irrigation', 'machinery-repair', 'crop-management',
    'soil-analysis', 'harvest', 'livestock', 'greenhouse', 'organic-farming',
    'fertilizer-management', 'plant-disease', 'equipment-maintenance'
  ];

  // ==================== FORM HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSkillChange = (skill) => {
    const updatedSkills = form.skills.includes(skill)
      ? form.skills.filter(s => s !== skill)  // Remove skill
      : [...form.skills, skill];               // Add skill
    
    setForm({ ...form, skills: updatedSkills });
  };

  // ==================== VALIDATION ====================
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name || !form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!form.password || !form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Skills validation for workers
    if (form.role === "worker" && form.skills.length === 0) {
      newErrors.skills = "Agricultural workers must select at least one skill";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== SIGNUP HANDLER (CORRECTED) ====================
  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      console.log("Sending signup data:", {
        name: form.name,
        email: form.email,
        role: form.role,
        skills: form.skills
      });

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          skills: form.skills
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        // Store authentication data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Show success message
        setShowSuccess(true);
        
        console.log("Signup successful...");
        
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
        
      } else {
        // Handle specific error responses
        setErrors({ general: data.error || data.message || "Registration failed. Please try again." });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER COMPONENT ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-green-400 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        
        {/* ==================== SUCCESS MESSAGE (ENHANCED) ==================== */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center animate-bounce shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-3xl">🎉</span>
              <span className="font-bold text-lg">Welcome to AgriAssistify.ai!</span>
            </div>
          </div>
        )}

        {/* ==================== HEADER ====================*/}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
              Sign up
          </h2>
          <p className="text-green-100 text-lg">
            Connect with the intelligent agriculture community
          </p>
        </div>

        {/* ==================== SIGNUP FORM ==================== */}
        <form onSubmit={handleSignup} className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* ==================== NAME INPUT ==================== */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Your Name"
                className={`w-full px-4 py-3 border ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white-900`}
                value={form.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* ==================== EMAIL INPUT ==================== */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email"
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white-900`}
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* ==================== PASSWORD INPUT ==================== */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Your Password"
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white-900`}
                value={form.password}
                onChange={handleChange}
                minLength="6"
                required
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* ==================== CONFIRM PASSWORD INPUT ==================== */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter Your Confirm Password"
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white-900`}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* ==================== ROLE SELECTION ==================== */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Role in Agriculture
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                required
              >
                <option value="farmer">🌱 Farmer - Report and track farm issues</option>
                <option value="worker">🔧 Agricultural Worker - Solve farm problems</option>
                <option value="moderator">👨‍🌾 Farm Moderator - Oversee operations</option>
              </select>
            </div>

            {/* ==================== SKILLS SELECTION (FIXED STYLING) ==================== */}
            {form.role === "worker" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Agricultural Expertise
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  {skillOptions.map(skill => (
                    <label 
                      key={skill} 
                      className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={form.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 font-medium capitalize">
                        {skill.replace(/-/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.skills && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.skills}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ==================== SUBMIT BUTTON ==================== */}
          <div>
            
            <button
              type="submit"
              to = "/login"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105'
              } transition-all duration-200 shadow-lg`}

              
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Signup'
              )}
            </button>
          </div>

          {/* ==================== TERMS AND CONDITIONS ==================== */}
          <div className="text-center text-xs text-gray-600">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-500 font-medium underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-500 font-medium underline">Privacy Policy</Link>
          </div>

          {/* ==================== LOGIN LINK ==================== */}
          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Already helping farmers?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200 underline"
              >
                Login 
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
