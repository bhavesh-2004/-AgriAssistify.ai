/**
 * AUTH.JSX - AgriAssistify.ai Authentication Wrapper
 * Custom redirect configuration as requested
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute = true }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      console.log("🔍 Auth Check:", { 
        hasToken: !!token, 
        hasUser: !!user, 
        protectedRoute,
        currentPath: window.location.pathname
      });

      if (protectedRoute) {
        // Protected route - user MUST be logged in
        if (!token || !user) {
          console.log("❌ No auth on protected route, redirecting to login");
          navigate("/login", { replace: true });
        } else {
          console.log("✅ Authenticated, rendering protected content");
        }
      } else {
        // Public route handling
        if (token && user) {
          const currentPath = window.location.pathname;
          
          // ✅ YOUR CONFIGURATION: Authenticated user visits signup → redirect to login
          if (currentPath === "/signup") {
            console.log("✅ Authenticated user on signup page, redirecting to login");
            navigate("/login", { replace: true });
          } 
          // Authenticated user visits login → redirect to dashboard
          else if (currentPath === "/login") {
            console.log("✅ Already authenticated on login page, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          } 
          // Home page and other public pages → allow access
          else {
            console.log("✅ Authenticated user on public page, allowing access");
          }
        } else {
          console.log("✅ Public route, rendering content");
        }
      }

      // Always set loading to false
      setLoading(false);
    };

    checkAuthentication();
  }, [navigate, protectedRoute]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-500 to-green-400">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🌾</span>
            </div>
          </div>
          <p className="text-white text-xl font-semibold mt-4">Loading AgriAssistify.ai...</p>
          <p className="text-green-100 text-sm mt-2">Checking authentication</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default CheckAuth;
