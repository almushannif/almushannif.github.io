// Configuration constants used across modules
export const CONFIG = {
  BASE_API_URL: 'https://script.google.com/macros/s/AKfycbwWODoQ-c-oeHSwqkW8FkDM_yYzkruP2FWeQNOvqkzpOWJ0b4Mz0sRLOG1z2cwEr1Ir/exec', // Google Apps Script Web App URL
  TIMEOUT: 15000,
  GOOGLE_CLIENT_ID: 'REPLACE_WITH_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};

// Utility to load HTML components into placeholders
export async function loadComponent(selector, path){
  const el = document.querySelector(selector);
  if(!el) return;
  try{
    const res = await fetch(path);
    const html = await res.text();
    el.innerHTML = html;
  }catch(err){
    console.error('Failed to load component', path, err);
  }
}

// Auto-load common components when script is imported
if(typeof window !== 'undefined'){
  loadComponent('#navbar-placeholder','/components/navbar.html');
  loadComponent('#footer-placeholder','/components/footer.html');
  loadComponent('#sidebar-placeholder','/components/sidebar.html');
}
