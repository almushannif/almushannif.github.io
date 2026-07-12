/**
 * dashboard.js - Dashboard Module
 * Handles dashboard initialization and functionality
 */

import CONFIG from './config.js';
import { api } from './api.js';
import { auth } from './auth.js';
import { componentLoader } from './components.js';
import { isAuthenticated, showToast, formatCurrency } from './utils.js';

class Dashboard {
  constructor() {
    this.user = null;
    this.statistics = null;
    this.chartInstance = null;
  }

  /**
   * Initialize dashboard
   */
  async init() {
    try {
      // Check authentication
      if (!isAuthenticated()) {
        window.location.href = CONFIG.ROUTES.LOGIN;
        return;
      }

      // Load components
      await componentLoader.loadAllComponents();

      // Load user data
      this.user = auth.getCurrentUser();
      this.displayUserInfo();

      // Load statistics
      await this.loadStatistics();

      // Initialize chart
      this.initChart();

      // Setup event listeners
      this.attachEventListeners();
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      showToast('Gagal memuat dashboard', 'error');
    }
  }

  /**
   * Display user information
   */
  displayUserInfo() {
    const userNameEl = document.querySelector('[data-user-name]');
    const userEmailEl = document.querySelector('[data-user-email]');
    const userAvatarEl = document.querySelector('[data-user-avatar]');

    if (userNameEl && this.user?.name) {
      userNameEl.textContent = this.user.name;
    }

    if (userEmailEl && this.user?.email) {
      userEmailEl.textContent = this.user.email;
    }

    if (userAvatarEl && this.user?.picture) {
      userAvatarEl.src = this.user.picture;
    }
  }

  /**
   * Load statistics data
   */
  async loadStatistics() {
    try {
      this.statistics = await api.getStatistics();

      if (this.statistics) {
        this.displayStatistics();
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }

  /**
   * Display statistics cards
   */
  displayStatistics() {
    const summaryCards = document.getElementById('summary-cards');
    if (!summaryCards || !this.statistics) return;

    const stats = [
      { label: 'Santri', value: this.statistics.students || 0, icon: 'fa-users' },
      { label: 'Guru', value: this.statistics.teachers || 0, icon: 'fa-chalkboard-user' },
      { label: 'Alumni', value: this.statistics.alumni || 0, icon: 'fa-graduation-cap' },
      { label: 'Hafidz', value: this.statistics.hafidz || 0, icon: 'fa-quran' }
    ];

    summaryCards.innerHTML = stats.map(stat => `
      <div class="stat-card glass p-4">
        <div class="stat-icon">
          <i class="fa-solid ${stat.icon}"></i>
        </div>
        <div class="stat-content">
          <h4>${stat.value.toLocaleString('id-ID')}</h4>
          <p>${stat.label}</p>
        </div>
      </div>
    `).join('');
  }

  /**
   * Initialize chart
   */
  initChart() {
    const chartCanvas = document.getElementById('chart-stats');
    if (!chartCanvas || !window.Chart) return;

    const ctx = chartCanvas.getContext('2d');

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Santri', 'Guru', 'Alumni', 'Hafidz'],
        datasets: [{
          data: [
            this.statistics?.students || 520,
            this.statistics?.teachers || 45,
            this.statistics?.alumni || 320,
            this.statistics?.hafidz || 120
          ],
          backgroundColor: [
            CONFIG.THEME.COLORS.PRIMARY,
            CONFIG.THEME.COLORS.SUCCESS,
            CONFIG.THEME.COLORS.INFO,
            CONFIG.THEME.COLORS.WARNING
          ],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Logout button
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
      });
    }

    // Profile button
    const profileBtn = document.querySelector('[data-action="profile"]');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        this.showProfileModal();
      });
    }
  }

  /**
   * Show profile modal
   */
  showProfileModal() {
    if (!window.Swal) return;

    const Swal = window.Swal;
    Swal.fire({
      title: 'Profil Pengguna',
      html: `
        <div class="text-start">
          <p><strong>Nama:</strong> ${this.user?.name || '-'}</p>
          <p><strong>Email:</strong> ${this.user?.email || '-'}</p>
          <p><strong>ID Pengguna:</strong> ${this.user?.id || '-'}</p>
        </div>
      `,
      confirmButtonText: 'Tutup',
      confirmButtonColor: CONFIG.THEME.COLORS.PRIMARY
    });
  }
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new Dashboard();
  dashboard.init();
});

export default Dashboard;