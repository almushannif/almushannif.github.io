# Sistem Informasi Pondok Pesantren Al‑Mushannif — Scaffold

Ini adalah scaffold awal yang saya tambahkan ke cabang default (`main`). Tujuannya menyediakan struktur file, styling dasar, dan modul JS untuk fase pengembangan berikutnya.

Files added (initial scaffold):
- index.html, login.html, dashboard.html, 404.html
- assets/css/{style.css,dashboard.css,login.css,responsive.css}
- assets/js/{config.js,api.js,auth.js,dashboard.js,utils.js}
- components/{navbar.html,sidebar.html,footer.html,loader.html}
- manifest.json, robots.txt, sitemap.xml

Catatan:
- Ganti CONFIG.BASE_API_URL di assets/js/config.js dengan URL Google Apps Script Anda.
- Google Sign-In belum diintegrasikan — auth.js berisi stub signInWithGoogle untuk pengembangan lokal.
- Semua JS dibangun sebagai ES6 modules, tidak ada inline styles (kecuali very small script in navbar component for theme toggle progressive enhancement).

Langkah selanjutnya saya akan kerjakan:
1. Integrasi Google Sign-In (memasang Google Identity Services, menukar token dengan Apps Script endpoint `action=login`).
2. Membangun API endpoints pada Google Apps Script dan menghubungkannya melalui api.js.
3. Membuat halaman CRUD pertama: Santri (table, pagination, tambah/edit/hapus).

Jika Anda ingin saya lanjutkan langsung, saya akan mulai dengan integrasi auth dan membuat branch fitur untuk PR, atau saya bisa terus commit ke main seperti scaffold ini.
