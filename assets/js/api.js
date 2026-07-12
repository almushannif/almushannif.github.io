/**
 * api.js - API Client Module
 * Handles all API requests to Google Apps Script and other services
 */

import CONFIG from './config.js';
import { showToast, getAuthToken } from './utils.js';

class APIClient {
  constructor() {
    this.baseURL = CONFIG.API.GOOGLE_APPS_SCRIPT;
    this.timeout = 10000;
  }

  /**
   * Make HTTP request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Response data
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      requiresAuth = false
    } = options;

    try {
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (requiresAuth) {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
        requestOptions.headers['Authorization'] = `Bearer ${token}`;
      }

      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await Promise.race([
        fetch(endpoint, requestOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        )
      ]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Submit PPDB form to Google Apps Script
   * @param {Object} formData - Form data object
   * @returns {Promise<Object>} - Response
   */
  async submitPPDB(formData) {
    try {
      const response = await this.request(CONFIG.API.PPDB_SUBMIT, {
        method: 'POST',
        body: formData
      });

      if (response.success) {
        showToast('Pendaftaran berhasil! Terima kasih.', 'success');
      } else {
        showToast(response.message || 'Terjadi kesalahan', 'error');
      }

      return response;
    } catch (error) {
      showToast('Gagal mengirim data pendaftaran', 'error');
      throw error;
    }
  }

  /**
   * Fetch news/berita from Google Apps Script
   * @returns {Promise<Array>} - News array
   */
  async fetchNews() {
    try {
      const response = await this.request(CONFIG.API.NEWS_FEED);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Fetch donation status
   * @returns {Promise<Array>} - Donation programs
   */
  async fetchDonationStatus() {
    try {
      const response = await this.request(CONFIG.API.DONATION_STATUS);
      return response.data || CONFIG.DONATIONS.PROGRAMS;
    } catch (error) {
      console.error('Failed to fetch donation status:', error);
      return CONFIG.DONATIONS.PROGRAMS;
    }
  }

  /**
   * Verify Google token and authenticate
   * @param {string} googleToken - Google identity token
   * @returns {Promise<Object>} - Auth response
   */
  async authenticateWithGoogle(googleToken) {
    try {
      const response = await this.request(CONFIG.API.GOOGLE_APPS_SCRIPT, {
        method: 'POST',
        body: {
          action: 'verifyGoogleToken',
          token: googleToken
        }
      });

      if (response.success && response.authToken) {
        return response;
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      showToast('Gagal melakukan autentikasi', 'error');
      throw error;
    }
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile data
   */
  async getUserProfile() {
    try {
      const response = await this.request(
        `${CONFIG.API.GOOGLE_APPS_SCRIPT}?action=getUserProfile`,
        { requiresAuth: true }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} - Updated profile
   */
  async updateUserProfile(profileData) {
    try {
      const response = await this.request(CONFIG.API.GOOGLE_APPS_SCRIPT, {
        method: 'POST',
        body: {
          action: 'updateProfile',
          data: profileData
        },
        requiresAuth: true
      });

      if (response.success) {
        showToast('Profil berhasil diperbarui', 'success');
      }

      return response.data;
    } catch (error) {
      showToast('Gagal memperbarui profil', 'error');
      throw error;
    }
  }

  /**
   * Contact form submission
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} - Response
   */
  async submitContactForm(contactData) {
    try {
      const response = await this.request(CONFIG.API.GOOGLE_APPS_SCRIPT, {
        method: 'POST',
        body: {
          action: 'submitContact',
          data: contactData
        }
      });

      if (response.success) {
        showToast('Pesan berhasil dikirim. Terima kasih!', 'success');
      }

      return response;
    } catch (error) {
      showToast('Gagal mengirim pesan', 'error');
      throw error;
    }
  }

  /**
   * Get statistics data
   * @returns {Promise<Object>} - Statistics data
   */
  async getStatistics() {
    try {
      const response = await this.request(
        `${CONFIG.API.GOOGLE_APPS_SCRIPT}?action=getStatistics`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      return null;
    }
  }
}

export const api = new APIClient();
export default api;