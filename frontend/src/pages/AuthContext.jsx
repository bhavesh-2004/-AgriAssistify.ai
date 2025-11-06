// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Check existing auth on app start
//   useEffect(() => {
//     checkExistingAuth();
//   }, []);

//   const checkExistingAuth = () => {
//     // Check both storage locations
//     const token = sessionStorage.getItem('token') || localStorage.getItem('token');
//     const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
    
//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         logout();
//       }
//     }
//     setLoading(false);
//   };

//   const login = (token, userData) => {
//     // Store in both locations for compatibility
//     sessionStorage.setItem('token', token);
//     sessionStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
    
//     setUser(userData);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     // Clear all storage
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
    
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//     checkExistingAuth
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };