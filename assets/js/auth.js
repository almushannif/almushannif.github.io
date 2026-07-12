import { CONFIG } from './config.js';
import { callApi } from './api.js';

// Simple client-side session (in-memory + localStorage)
const KEY = 'alm_user_session';
let gsiInitialized = false;

/**
 * Handle credential response from Google Identity Services
 * @param {object} response
 */
async function handleCredentialResponse(response){
  const id_token = response && response.credential;
  if(!id_token){
    console.error('No credential received from Google Identity Services');
    return;
  }

  try{
    // Send the id_token to Apps Script endpoint for verification and session creation
    const res = await callApi('login', { method: 'POST', body: { id_token } });
    if(res && res.success && res.user){
      localStorage.setItem(KEY, JSON.stringify(res.user));
      // redirect to dashboard
      window.location.href = '/dashboard.html';
    }else{
      console.error('Login failed', res);
      alert(res && res.message ? res.message : 'Gagal masuk');
    }
  }catch(err){
    console.error('Login error', err);
    alert('Gagal masuk: ' + (err.message || err));
  }
}

/**
 * Initialize Google Identity Services button when gsi client is available
 */
function initGSI(){
  if(typeof window === 'undefined' || !window.google || gsiInitialized) return;
  const clientId = CONFIG.GOOGLE_CLIENT_ID;
  if(!clientId || clientId.includes('REPLACE_WITH')){
    console.warn('CONFIG.GOOGLE_CLIENT_ID is not set. Set it in assets/js/config.js to enable Google Sign-In.');
    // Provide a fallback button for demo purposes
    renderFallbackButton();
    return;
  }

  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    ux_mode: 'popup'
  });

  google.accounts.id.renderButton(
    document.getElementById('g_id_signin'),
    { theme: 'outline', size: 'large', width: '250' }
  );

  // Optionally prompt the One Tap
  // google.accounts.id.prompt();
  gsiInitialized = true;
}

function renderFallbackButton(){
  const container = document.getElementById('g_id_signin');
  if(!container) return;
  container.innerHTML = '<button id="btn-google-signin" class="btn btn-primary">Masuk dengan Google (Demo)</button>';
  const btn = document.getElementById('btn-google-signin');
  if(btn){
    btn.addEventListener('click', async ()=>{
      // In demo mode, just create a fake session
      const demo = { name: 'Demo User', email: 'demo@example.com', role: 'Admin' };
      localStorage.setItem(KEY, JSON.stringify(demo));
      window.location.href = '/dashboard.html';
    });
  }
}

/**
 * Public API: sign out the current session
 */
export function signOut(){
  localStorage.removeItem(KEY);
  // optionally revoke token via Google API if necessary
}

export function getSession(){
  try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){return null}
}

export function requireRole(roles = []){
  const session = getSession();
  if(!session) return false;
  if(!roles.length) return true;
  return roles.includes(session.role);
}

// Wait for GSI client to load. Poll briefly if needed.
if(typeof window !== 'undefined'){
  // Try immediate init
  setTimeout(initGSI, 500);
  // Poll up to a few seconds
  let checks = 0;
  const iv = setInterval(()=>{
    checks++;
    if(window.google){ initGSI(); clearInterval(iv); }
    if(checks > 12){ clearInterval(iv); }
  }, 500);
}
