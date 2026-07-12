/* Main JavaScript for Pondok Pesantren Al-Mushannif
   - Init AOS, Swiper
   - Preloader handling
   - Dark mode toggle (localStorage)
   - Smooth scroll, sticky navbar
   - Counters using IntersectionObserver
   - Lightbox modal for galeri
*/

document.addEventListener('DOMContentLoaded', function () {
  // Preloader
  const preloader = document.getElementById('preloader');
  window.setTimeout(() => {
    preloader.classList.add('hidden');
  }, 600);

  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Initialize AOS
  if (window.AOS) AOS.init({ once: true, duration: 800 });

  // Initialize Swiper for prestasi
  if (window.Swiper) {
    new Swiper('.prestige-swiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });
  }

  // Dark mode toggle
  const themeToggle = document.getElementById('darkModeToggle');
  const root = document.documentElement;
  function setTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
  updateThemeIcon(saved);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '<i class=\"fa-solid fa-sun\"></i>' : '<i class=\"fa-regular fa-moon\"></i>';
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Sticky navbar change on scroll
  const navbar = document.getElementById('mainNav');
  function onScroll() {
    if (window.scrollY > 80) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');

    // Back to top
    const back = document.getElementById('backToTop');
    if (window.scrollY > 400) back.classList.add('show'); else back.classList.remove('show');
  }
  onScroll();
  document.addEventListener('scroll', onScroll);

  // Back to top click
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Counters - animate when visible
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-target') || 0;
        const duration = 1600;
        const start = performance.now();
        const initial = 0;
        function animate(t) {
          const elapsed = t - start;
          const prog = Math.min(elapsed / duration, 1);
          const value = Math.floor(initial + (target - initial) * prog);
          el.textContent = value;
          if (prog < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));

  // Gallery lightbox using bootstrap modal
  const galleryImages = document.querySelectorAll('.masonry-item img');
  const lightboxImage = document.getElementById('lightboxImage');
  galleryImages.forEach(img => {
    img.addEventListener('click', function () {
      const src = this.dataset.src || this.src;
      lightboxImage.src = src;
    });
  });

  // Contact form submit -> SweetAlert2 simulation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      Swal.fire({
        title: 'Terima Kasih',
        text: 'Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.',
        icon: 'success',
        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#0B6E4F'
      });
      contactForm.reset();
    });
  }

  // WhatsApp float (small animation)
  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('mouseenter', () => whatsappFloat.style.transform = 'translateY(-6px)');
    whatsappFloat.addEventListener('mouseleave', () => whatsappFloat.style.transform = 'translateY(0)');
  }

  // Lazy loading is handled by loading="lazy" attributes in <img> and <iframe>

  // Accessibility: close any open dropdowns on Escape
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(m => {
        const bs = bootstrap.Dropdown.getOrCreateInstance(m.previousElementSibling);
        bs.hide();
      });
    }
  });

  // Optional: show a welcome toast for first-time visitors (comment/uncomment as needed)
  // if (!localStorage.getItem('welcomeShown')) {
  //   Swal.fire({ title: 'Selamat Datang', text: 'Selamat datang di Pondok Pesantren Al-Mushannif', timer: 2500, showConfirmButton: false });
  //   localStorage.setItem('welcomeShown', '1');
  // }

});
