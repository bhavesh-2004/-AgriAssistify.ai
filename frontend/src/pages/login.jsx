/**
 * LOGIN.JSX - AgriAssistify.ai User Authentication
 * 
 * Professional login form for the Intelligent Agriculture Issue Tracker
 * Features proper error handling, agriculture theming, and role-based navigation
 * Integrates with your existing backend authentication system
 */

// ==================== IMPORTS ====================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ==================== LOGIN COMPONENT ====================
export default function LoginPage() {
  // ==================== STATE MANAGEMENT ====================
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // ==================== FORM HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // ==================== VALIDATION ====================
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.password || !form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== LOGIN HANDLER ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      console.log("Attempting login with:", { email: form.email });

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        // Store authentication data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Show success message
        setShowSuccess(true);
        
        console.log("Login successful, redirecting to home...");
        
        // Redirect after brief success display
        setTimeout(() => {
          navigate("/");
        }, 1500);
        
      } else {
        // Handle specific error responses
        setErrors({ general: data.error || data.message || "Login failed. Please try again." });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER COMPONENT ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-green-400 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* ==================== SUCCESS MESSAGE ==================== */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center animate-bounce">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">✅</span>
              <span className="font-semibold">Login successful! Redirecting...</span>
            </div>
          </div>
        )}

        {/* ==================== HEADER ==================== */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-green-100 text-lg">
            Sign in to manage your agricultural operations
          </p>
        </div>

        {/* ==================== LOGIN FORM ==================== */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          
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
            {/* ==================== EMAIL INPUT ==================== */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="kunal123@gmail.com"
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900`}
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
                placeholder="••••••••"
                className={`w-full px-4 py-3 border ${
                  errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900`}
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

            {/* ==================== REMEMBER ME & FORGOT PASSWORD ==================== */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          {/* ==================== SUBMIT BUTTON ==================== */}
          <div>
            <button
              type="submit"
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
                  Signing in...
                </>
              ) : (
                'Login '
              )}
            </button>
          </div>

          {/* ==================== ROLE INFORMATION PANEL ==================== */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
              🌱 User Roles in AgriAssistify.ai
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs text-green-700">
              <div className="flex items-center space-x-2 p-2 bg-white rounded">
                <span>🌱</span>
                <span><strong>Farmers:</strong> Report and track farm issues</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded">
                <span>🔧</span>
                <span><strong>Workers:</strong> Solve agricultural problems</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded">
                <span>👨‍🌾</span>
                <span><strong>Moderators:</strong> Oversee farm operations</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded">
                <span>👑</span>
                <span><strong>Admins:</strong> Full system management</span>
              </div>
            </div>
          </div>

          {/* ==================== SIGNUP LINK ==================== */}
          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              New to agricultural technology?{' '}
              <Link 
                to="/signup" 
                className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200 underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
