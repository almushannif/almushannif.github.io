/**
 * main.js - Main Initialization Module
 * Orchestrates all page initialization and setup
 */

import CONFIG from './config.js';
import { api } from './api.js';
import { auth } from './auth.js';
import { componentLoader } from './components.js';
import {
  hidePreloader,
  initializeDarkMode,
  initLazyLoadImages,
  initCounters,
  toggleDarkMode,
  smoothScroll,
  navigate
} from './utils.js';

class MainApp {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize main application
   */
  async init() {
    try {
      // Initialize dark mode
      initializeDarkMode();

      // Load components
      await componentLoader.loadAllComponents();

      // Initialize page-specific features
      this.initializePageFeatures();

      // Setup event listeners
      this.setupEventListeners();

      // Hide preloader
      hidePreloader();

      this.initialized = true;
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Application initialization failed:', error);
      hidePreloader();
    }
  }

  /**
   * Initialize page-specific features
   */
  initializePageFeatures() {
    const currentPage = window.location.pathname;

    // Home page features
    if (currentPage === '/' || currentPage.endsWith('index.html') || currentPage === '') {
      this.initHomePageFeatures();
    }

    // Login page features
    if (currentPage.includes('login.html')) {
      this.initLoginPageFeatures();
    }

    // PPDB page features
    if (currentPage.includes('ppdb.html')) {
      this.initPPDBPageFeatures();
    }

    // Donation page features
    if (currentPage.includes('donasi.html')) {
      this.initDonationPageFeatures();
    }
  }

  /**
   * Initialize home page features
   */
  initHomePageFeatures() {
    // Initialize lazy loading
    if (CONFIG.FEATURES.ENABLE_LAZY_LOADING) {
      initLazyLoadImages();
    }

    // Initialize counters
    initCounters();

    // Initialize AOS animations if available
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
      });
    }

    // Initialize Swiper if available
    this.initSwipers();

    // Setup smooth scroll for anchor links
    this.setupSmoothScroll();

    // Setup modal lightbox
    this.setupLightbox();

    // Setup contact form
    this.setupContactForm();

    // Back to top button
    this.setupBackToTop();

    // WhatsApp button
    this.setupWhatsAppButton();
  }

  /**
   * Initialize login page features
   */
  initLoginPageFeatures() {
    // Auth module handles sign-in
    auth.initGoogleSignIn();
  }

  /**
   * Initialize PPDB page features
   */
  initPPDBPageFeatures() {
    const form = document.getElementById('ppdbForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handlePPDBSubmit(e));
    }
  }

  /**
   * Initialize donation page features
   */
  initDonationPageFeatures() {
    // Load donation status
    this.loadDonationStatus();
  }

  /**
   * Setup smooth scroll for anchor links
   */
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          smoothScroll(href);
        }
      });
    });
  }

  /**
   * Setup Swiper carousels
   */
  initSwipers() {
    if (!window.Swiper) return;

    const Swiper = window.Swiper;

    // Prestasi slider
    const prestigeSwiper = document.querySelector('.prestige-swiper');
    if (prestigeSwiper) {
      new Swiper(prestigeSwiper, {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
          768: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          }
        }
      });
    }
  }

  /**
   * Setup lightbox for gallery
   */
  setupLightbox() {
    const images = document.querySelectorAll('.masonry-item img');
    images.forEach(img => {
      img.addEventListener('click', () => {
        const lightboxImage = document.getElementById('lightboxImage');
        if (lightboxImage) {
          lightboxImage.src = img.dataset.src || img.src;
        }
      });
    });
  }

  /**
   * Setup contact form
   */
  setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }
  }

  /**
   * Handle contact form submission
   * @param {Event} e - Submit event
   */
  async handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await api.submitContactForm(data);
      e.target.reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
    }
  }

  /**
   * Handle PPDB form submission
   * @param {Event} e - Submit event
   */
  async handlePPDBSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await api.submitPPDB(data);
      if (response.success) {
        // Redirect to thank you page
        setTimeout(() => {
          navigate(CONFIG.ROUTES.PPDB_THANKS);
        }, 2000);
      }
    } catch (error) {
      console.error('PPDB form submission failed:', error);
    }
  }

  /**
   * Load donation status
   */
  async loadDonationStatus() {
    try {
      const donations = await api.fetchDonationStatus();
      // Display donations (implementation depends on page structure)
    } catch (error) {
      console.error('Failed to load donation status:', error);
    }
  }

  /**
   * Setup back to top button
   */
  setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Setup WhatsApp floating button
   */
  setupWhatsAppButton() {
    const whatsappBtn = document.getElementById('whatsappFloat');
    if (whatsappBtn) {
      whatsappBtn.href = CONFIG.SOCIAL.WHATSAPP;
      whatsappBtn.target = '_blank';
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Dark mode toggle
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
      darkModeBtn.addEventListener('click', () => {
        toggleDarkMode();
      });
    }

    // Navbar brand click (go to home)
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
      navbarBrand.addEventListener('click', (e) => {
        if (navbarBrand.getAttribute('href') === '#') {
          e.preventDefault();
          smoothScroll('#hero');
        }
      });
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new MainApp();
  app.init();
});

export default MainApp;