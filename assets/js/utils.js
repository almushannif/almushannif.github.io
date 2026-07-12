/**
 * utils.js - Utility Functions & Helpers
 * Common functions for DOM manipulation, navigation, and UI interactions
 */

import CONFIG from './config.js';

/**
 * Navigate to a different page
 * @param {string} route - Route path from CONFIG.ROUTES
 * @param {Object} params - Optional query parameters
 */
export const navigate = (route, params = {}) => {
  let url = route;
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url = `${route}?${queryString}`;
  }
  window.location.href = url;
};

/**
 * Smooth scroll to element
 * @param {string} selector - Element selector or ID
 * @param {number} offset - Offset from top (default: 80px for navbar)
 */
export const smoothScroll = (selector, offset = 80) => {
  const element = document.querySelector(selector);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

/**
 * Toggle dark mode
 * @returns {string} - Current theme ('light' or 'dark')
 */
export const toggleDarkMode = () => {
  const html = document.documentElement;
  const currentTheme = localStorage.getItem(CONFIG.THEME.STORAGE_KEY) || CONFIG.THEME.DEFAULT;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem(CONFIG.THEME.STORAGE_KEY, newTheme);

  // Update toggle button icon
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
    }
  }

  return newTheme;
};

/**
 * Initialize dark mode from localStorage
 */
export const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem(CONFIG.THEME.STORAGE_KEY) || CONFIG.THEME.DEFAULT;
  document.documentElement.setAttribute('data-bs-theme', savedTheme);

  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
    }
  }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = CONFIG.TIMEOUTS.DEBOUNCE_DELAY) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = CONFIG.TIMEOUTS.DEBOUNCE_DELAY) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Format date to Indonesian locale
 * @param {Date|string} date - Date object or string
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format currency to IDR
 * @param {number} amount - Amount in rupiah
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export const showToast = async (message, type = 'info', duration = CONFIG.TIMEOUTS.TOAST_DURATION) => {
  const Swal = window.Swal;
  if (Swal) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: duration
    });
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @returns {Promise<boolean>} - User confirmation result
 */
export const showConfirmation = async (title, message) => {
  const Swal = window.Swal;
  if (Swal) {
    const result = await Swal.fire({
      title,
      html: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: CONFIG.THEME.COLORS.PRIMARY,
      cancelButtonColor: CONFIG.THEME.COLORS.DANGER
    });
    return result.isConfirmed;
  }
  return confirm(`${title}\n\n${message}`);
};

/**
 * Hide preloader
 */
export const hidePreloader = () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      preloader.style.transition = 'opacity 0.5s ease-out, visibility 0.5s ease-out';
    }, CONFIG.TIMEOUTS.PRELOADER_HIDE);
  }
};

/**
 * Get authentication token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem(CONFIG.AUTH.AUTH_TOKEN_KEY);
};

/**
 * Set authentication token
 * @param {string} token - Auth token
 * @param {number} expiryHours - Token expiry in hours
 */
export const setAuthToken = (token, expiryHours = 24) => {
  localStorage.setItem(CONFIG.AUTH.AUTH_TOKEN_KEY, token);
  const expiryTime = new Date().getTime() + (expiryHours * 60 * 60 * 1000);
  localStorage.setItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const expiry = localStorage.getItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return false;

  if (new Date().getTime() > parseInt(expiry)) {
    clearAuthData();
    return false;
  }

  return true;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem(CONFIG.AUTH.AUTH_TOKEN_KEY);
  localStorage.removeItem(CONFIG.AUTH.USER_DATA_KEY);
  localStorage.removeItem(CONFIG.AUTH.TOKEN_EXPIRY_KEY);
  localStorage.removeItem(CONFIG.AUTH.SESSION_KEY);
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - User data or null
 */
export const getUserData = () => {
  const data = localStorage.getItem(CONFIG.AUTH.USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Set user data to localStorage
 * @param {Object} userData - User data object
 */
export const setUserData = (userData) => {
  localStorage.setItem(CONFIG.AUTH.USER_DATA_KEY, JSON.stringify(userData));
};

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element
 * @returns {boolean} - Is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Lazy load images
 */
export const initLazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }
};

/**
 * Counter animation for statistics
 * @param {Element} element - Counter element
 * @param {number} target - Target number
 * @param {number} duration - Duration in milliseconds
 */
export const animateCounter = (element, target, duration = 2000) => {
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString('id-ID');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString('id-ID');
    }
  }, 16);
};

/**
 * Initialize all counters when in viewport
 */
export const initCounters = () => {
  const counters = document.querySelectorAll('.counter');
  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        entry.target.classList.add('animated');
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone - Phone number
 * @returns {boolean} - Is valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Get URL query parameter
 * @param {string} param - Parameter name
 * @returns {string|null} - Parameter value or null
 */
export const getQueryParam = (param) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Copy result
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Berhasil disalin ke clipboard', 'success');
    return true;
  } catch (err) {
    showToast('Gagal menyalin ke clipboard', 'error');
    return false;
  }
};

export default {
  navigate,
  smoothScroll,
  toggleDarkMode,
  initializeDarkMode,
  debounce,
  throttle,
  formatDate,
  formatCurrency,
  showToast,
  showConfirmation,
  hidePreloader,
  getAuthToken,
  setAuthToken,
  isAuthenticated,
  clearAuthData,
  getUserData,
  setUserData,
  isInViewport,
  initLazyLoadImages,
  animateCounter,
  initCounters,
  isValidEmail,
  isValidPhone,
  getQueryParam,
  copyToClipboard
};