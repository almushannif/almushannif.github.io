/**
 * components.js - Component Loader
 * Dynamically loads reusable HTML components
 */

import CONFIG from './config.js';
import { isAuthenticated, getUserData } from './utils.js';

class ComponentLoader {
  constructor() {
    this.cache = {};
    this.components = CONFIG.COMPONENTS;
  }

  /**
   * Load component HTML
   * @param {string} componentName - Component name (navbar, footer, etc)
   * @param {string} containerId - Container element ID
   * @returns {Promise<void>}
   */
  async loadComponent(componentName, containerId) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Container ${containerId} not found`);
        return;
      }

      const componentPath = this.components[componentName.toUpperCase()];
      if (!componentPath) {
        console.warn(`Component ${componentName} not found in config`);
        return;
      }

      // Use cache if available
      if (this.cache[componentName]) {
        container.innerHTML = this.cache[componentName];
        this.attachEventListeners(componentName, container);
        return;
      }

      const response = await fetch(componentPath);
      if (!response.ok) throw new Error(`Failed to load ${componentName}`);

      const html = await response.text();
      this.cache[componentName] = html;

      container.innerHTML = html;
      this.attachEventListeners(componentName, container);
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
    }
  }

  /**
   * Load all required components
   * @returns {Promise<void>}
   */
  async loadAllComponents() {
    try {
      // Load navbar if placeholder exists
      if (document.getElementById('navbar-placeholder')) {
        await this.loadComponent('NAVBAR', 'navbar-placeholder');
      }

      // Load sidebar for dashboard
      if (document.getElementById('sidebar-placeholder')) {
        await this.loadComponent('SIDEBAR', 'sidebar-placeholder');
      }

      // Load footer if placeholder exists
      if (document.getElementById('footer-placeholder')) {
        await this.loadComponent('FOOTER', 'footer-placeholder');
      }
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }

  /**
   * Attach event listeners to component
   * @param {string} componentName - Component name
   * @param {Element} container - Component container
   */
  attachEventListeners(componentName, container) {
    if (componentName === 'NAVBAR') {
      this.attachNavbarListeners(container);
    } else if (componentName === 'SIDEBAR') {
      this.attachSidebarListeners(container);
    } else if (componentName === 'FOOTER') {
      this.attachFooterListeners(container);
    }
  }

  /**
   * Attach navbar event listeners
   * @param {Element} navbar - Navbar element
   */
  attachNavbarListeners(navbar) {
    // Smooth scroll for anchor links
    const anchorLinks = navbar.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        this.smoothScroll(target);
        this.closeNavbarMenu(navbar);
      });
    });

    // Dark mode toggle
    const darkModeBtn = navbar.querySelector('#darkModeToggle');
    if (darkModeBtn) {
      darkModeBtn.addEventListener('click', () => {
        this.toggleDarkMode();
      });
    }

    // Login button
    const loginBtn = navbar.querySelector('a[href*="login"]');
    if (loginBtn) {
      const isAuth = isAuthenticated();
      if (isAuth) {
        const user = getUserData();
        loginBtn.textContent = `${user?.name || 'User'}`;
        loginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    }
  }

  /**
   * Attach sidebar event listeners
   * @param {Element} sidebar - Sidebar element
   */
  attachSidebarListeners(sidebar) {
    // Close button
    const closeBtn = sidebar.querySelector('.sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.toggleSidebar(false);
      });
    }

    // Menu items
    const menuItems = sidebar.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        this.toggleSidebar(false);
      });
    });

    // Logout button
    const logoutBtn = sidebar.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  /**
   * Attach footer event listeners
   * @param {Element} footer - Footer element
   */
  attachFooterListeners(footer) {
    const year = footer.querySelector('#year');
    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }

  /**
   * Smooth scroll to anchor
   * @param {string} selector - Anchor selector
   */
  smoothScroll(selector) {
    const element = document.querySelector(selector);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Close navbar menu
   * @param {Element} navbar - Navbar element
   */
  closeNavbarMenu(navbar) {
    const toggler = navbar.querySelector('.navbar-toggler');
    const menu = navbar.querySelector('.navbar-collapse');
    if (toggler && menu && menu.classList.contains('show')) {
      toggler.click();
    }
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('al_mushannif_theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('al_mushannif_theme', newTheme);
  }

  /**
   * Toggle sidebar visibility
   * @param {boolean} show - Show or hide
   */
  toggleSidebar(show = true) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (show) {
        sidebar.classList.add('show');
      } else {
        sidebar.classList.remove('show');
      }
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('al_mushannif_token');
    localStorage.removeItem('al_mushannif_user');
    window.location.href = '/';
  }
}

export const componentLoader = new ComponentLoader();

// Auto-load components on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  componentLoader.loadAllComponents();
});

export default componentLoader;