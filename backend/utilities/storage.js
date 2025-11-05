// /**
//  * STORAGE.JS - AgriAssistify.ai Storage Management
//  * Automatic migration from localStorage to sessionStorage
//  */

// // Storage version for tracking migrations
// const STORAGE_VERSION = '1.1';
// const VERSION_KEY = 'agriassistify_storage_version';

// class StorageManager {
//   constructor() {
//     this.init();
//   }

//   init() {
//     this.migrateStorage();
//     this.setupStorageCleanup();
//   }

//   // Migrate old localStorage data to sessionStorage
//   migrateStorage() {
//     const currentVersion = localStorage.getItem(VERSION_KEY);
    
//     if (currentVersion !== STORAGE_VERSION) {
//       console.log('🔄 Migrating storage to new version...');
      
//       // List of keys to migrate
//       const keysToMigrate = ['token', 'user'];
      
//       keysToMigrate.forEach(key => {
//         const oldValue = localStorage.getItem(key);
//         if (oldValue) {
//           // Move to sessionStorage
//           sessionStorage.setItem(key, oldValue);
//           console.log(`✅ Migrated ${key} to session storage`);
//         }
//         // Remove from localStorage
//         localStorage.removeItem(key);
//       });
      
//       // Set new version
//       localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
//       console.log('✅ Storage migration completed');
//     }
//   }

//   // Setup automatic cleanup
//   setupStorageCleanup() {
//     // Clear sessionStorage on page unload (optional)
//     window.addEventListener('beforeunload', () => {
//       // Only clear if user is not navigating within the app
//       if (!sessionStorage.getItem('navigating')) {
//         this.clearAuthData();
//       }
//     });

//     // Mark navigation within app
//     window.addEventListener('beforeunload', () => {
//       sessionStorage.setItem('navigating', 'true');
//     });
//   }

//   // Auth methods
//   setAuthData(token, userData) {
//     sessionStorage.setItem('token', token);
//     sessionStorage.setItem('user', JSON.stringify(userData));
//   }

//   getAuthData() {
//     const token = sessionStorage.getItem('token');
//     const userData = sessionStorage.getItem('user');
    
//     return {
//       token,
//       user: userData ? JSON.parse(userData) : null
//     };
//   }

//   clearAuthData() {
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//     sessionStorage.removeItem('navigating');
//     // Also clear any old localStorage data
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   isAuthenticated() {
//     const { token, user } = this.getAuthData();
//     return !!(token && user);
//   }
// }

// // Create singleton instance
// const storageManager = new StorageManager();
// export default storageManager;
