/**
 * auth.js - Authentication Module
 * Handles user authentication, session management, and redirects
 */

import CONFIG from './config.js';
import { api } from './api.js';
import {
  navigate,
  setAuthToken,
  setUserData,
  clearAuthData,
  isAuthenticated,
  showToast,
  getUserData
} from './utils.js';

class Auth {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize Google Sign-In
   */
  async initGoogleSignIn() {
    try {
      if (!window.google) {
        console.error('Google SDK not loaded');
        return;
      }

      google.accounts.id.initialize({
        client_id: CONFIG.AUTH.GOOGLE_CLIENT_ID,
        callback: this.handleGoogleSignIn.bind(this)
      });

      // Render Google Sign-In button if it exists
      const signInButton = document.getElementById('g_id_signin');
      if (signInButton) {
        google.accounts.id.renderButton(signInButton, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with'
        });
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
    }
  }

  /**
   * Handle Google Sign-In callback
   * @param {Object} response - Google response object
   */
  async handleGoogleSignIn(response) {
    try {
      if (!response.credential) {
        throw new Error('No credential received');
      }

      // Show loading toast
      showToast('Melakukan autentikasi...', 'info', 5000);

      // Verify token with backend
      const authResponse = await api.authenticateWithGoogle(response.credential);

      if (authResponse.success) {
        // Save authentication data
        setAuthToken(authResponse.authToken);
        setUserData(authResponse.user);

        showToast('Autentikasi berhasil!', 'success');

        // Redirect to dashboard
        setTimeout(() => {
          navigate(CONFIG.ROUTES.DASHBOARD);
        }, 1000);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      showToast('Gagal melakukan autentikasi. Silakan coba lagi.', 'error');
    }
  }

  /**
   * Logout current user
   */
  logout() {
    try {
      // Clear local auth data
      clearAuthData();

      // Revoke Google token if available
      if (window.google && google.accounts) {
        google.accounts.id.revoke(CONFIG.AUTH.GOOGLE_CLIENT_ID);
      }

      showToast('Anda telah logout', 'success');

      // Redirect to home
      setTimeout(() => {
        navigate(CONFIG.ROUTES.HOME);
      }, 500);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Check if user needs to be redirected
   */
  checkAuthRedirect() {
    const currentPath = window.location.pathname;

    // Dashboard requires authentication
    if (currentPath.includes('dashboard.html')) {
      if (!isAuthenticated()) {
        navigate(CONFIG.ROUTES.LOGIN);
      }
    }

    // Login page redirect if already authenticated
    if (currentPath.includes('login.html')) {
      if (isAuthenticated()) {
        navigate(CONFIG.ROUTES.DASHBOARD);
      }
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} - User data or null
   */
  getCurrentUser() {
    return isAuthenticated() ? getUserData() : null;
  }

  /**
   * Extend authentication session
   */
  extendSession() {
    const user = this.getCurrentUser();
    if (user) {
      setAuthToken(null);
      // In real app, would refresh token here
    }
  }
}

export const auth = new Auth();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  auth.checkAuthRedirect();
  if (document.getElementById('g_id_signin')) {
    auth.initGoogleSignIn();
  }
});

export default auth;