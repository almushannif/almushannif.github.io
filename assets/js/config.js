/**
 * config.js - Centralized Configuration & Constants
 * Manages all application settings, API endpoints, and constants
 */

export const CONFIG = {
  // Site Information
  SITE_NAME: 'Pondok Pesantren Al-Mushannif',
  SITE_TAGLINE: 'Membangun Generasi Qur\'ani, Berakhlakul Karimah',
  SITE_EMAIL: 'info@ponpes.id',
  SITE_PHONE: '+62 812-3456-7890',
  SITE_ADDRESS: 'Dusun Tenten Lauk, Desa Bujak, Kecamatan Batukliang, Lombok Tengah, NTB',
  SITE_LOCATION: {
    lat: -8.7333,
    lng: 116.3833,
    zoom: 15
  },

  // API Endpoints
  API: {
    GOOGLE_APPS_SCRIPT: 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent',
    PPDB_SUBMIT: '/apps-script/ppdb-submit',
    NEWS_FEED: '/apps-script/news-feed',
    DONATION_STATUS: '/apps-script/donation-status'
  },

  // Authentication
  AUTH: {
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    SESSION_KEY: 'al_mushannif_session',
    AUTH_TOKEN_KEY: 'al_mushannif_token',
    USER_DATA_KEY: 'al_mushannif_user',
    TOKEN_EXPIRY_KEY: 'al_mushannif_token_expiry'
  },

  // Theme
  THEME: {
    DEFAULT: 'light',
    STORAGE_KEY: 'al_mushannif_theme',
    COLORS: {
      PRIMARY: '#0B6E4F',
      SUCCESS: '#28a745',
      WARNING: '#ffc107',
      DANGER: '#dc3545',
      INFO: '#17a2b8',
      DARK: '#343a40',
      LIGHT: '#f8f9fa'
    }
  },

  // Navigation Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/login.html',
    DASHBOARD: '/dashboard.html',
    PPDB: '/ppdb.html',
    PPDB_THANKS: '/ppdb-thanks.html',
    DONATION: '/donasi.html',
    NOT_FOUND: '/404.html'
  },

  // Navigation Menu
  MENU: [
    { label: 'Beranda', href: '#hero', id: 'nav-home' },
    {
      label: 'Profil',
      id: 'nav-profil',
      submenu: [
        { label: 'Tentang', href: '#tentang' },
        { label: 'Sejarah', href: '#sejarah' },
        { label: 'Visi & Misi', href: '#visi-misi' },
        { label: 'Nilai-Nilai', href: '#nilai' },
        { label: 'Struktur Organisasi', href: '#struktur' },
        { label: 'Sambutan Pimpinan', href: '#sambutan' }
      ]
    },
    {
      label: 'Program Pendidikan',
      id: 'nav-programs',
      submenu: [
        { label: 'RA Al-Mushannif', href: '#programs' },
        { label: 'Tahfidz Al-Qur\'an', href: '#programs' },
        { label: 'Tahsin Al-Qur\'an', href: '#programs' },
        { label: 'Kajian Kitab Kuning', href: '#programs' },
        { label: 'Madrasah Diniyah', href: '#programs' },
        { label: 'TPQ', href: '#programs' },
        { label: 'Bahasa Arab', href: '#programs' },
        { label: 'Bahasa Inggris', href: '#programs' },
        { label: 'Komputer', href: '#programs' },
        { label: 'Life Skill', href: '#programs' },
        { label: 'BLKK', href: '#programs' }
      ]
    },
    { label: 'Santri', href: '#santri', id: 'nav-santri' },
    { label: 'Guru & Tendik', href: '#guru', id: 'nav-guru' },
    { label: 'Fasilitas', href: '#fasilitas', id: 'nav-fasilitas' },
    { label: 'Galeri', href: '#galeri', id: 'nav-galeri' },
    { label: 'Berita', href: '#berita', id: 'nav-berita' },
    { label: 'PPDB', href: '/ppdb.html', id: 'nav-ppdb', button: true },
    { label: 'Login', href: '/login.html', id: 'nav-login', action: 'login' }
  ],

  // Components
  COMPONENTS: {
    NAVBAR: '/components/navbar.html',
    FOOTER: '/components/footer.html',
    SIDEBAR: '/components/sidebar.html',
    LOADER: '/components/loader.html'
  },

  // Features
  FEATURES: {
    ENABLE_DARK_MODE: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_LAZY_LOADING: true,
    PRELOAD_IMAGES: true
  },

  // Timeouts & Intervals
  TIMEOUTS: {
    PRELOADER_HIDE: 2000,
    SCROLL_DURATION: 1000,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000
  },

  // Social Media
  SOCIAL: {
    FACEBOOK: 'https://facebook.com/almushannif',
    INSTAGRAM: 'https://instagram.com/almushannif',
    YOUTUBE: 'https://youtube.com/@almushannif',
    WHATSAPP: 'https://wa.me/6281234567890',
    TWITTER: 'https://twitter.com/almushannif'
  },

  // Donations
  DONATIONS: {
    PROGRAMS: [
      { id: 'wakaf', name: 'Wakaf', description: 'Dukung pembangunan fasilitas pondok.', progress: 48 },
      { id: 'infaq', name: 'Infaq & Sedekah', description: 'Ringankan beban pendidikan santri yang kurang mampu.', progress: 72 },
      { id: 'pembangunan', name: 'Pembangunan', description: 'Proyek pembangunan kelas dan asrama baru.', progress: 25 }
    ],
    PAYMENT_METHODS: ['QRIS', 'Bank Transfer', 'e-Wallet']
  }
};

export default CONFIG;