import { callApi } from './api.js';

// Simple client-side session (in-memory + localStorage)
const KEY = 'alm_user_session';

/**
 * Sign in flow (stub) — integrate Google Sign-In here
 */
export async function signInWithGoogle(){
  // This is a placeholder for the real Google Sign-In integration.
  // Replace this with the Google Identity Services (gsi) flow and exchange token with Apps Script.
  const demo = { name: 'Demo User', email: 'demo@example.com', role: 'Admin' };
  localStorage.setItem(KEY, JSON.stringify(demo));
  return demo;
}

export function signOut(){
  localStorage.removeItem(KEY);
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

// Example: wire button on pages that import this module
if(typeof document !== 'undefined'){
  const btn = document.getElementById('btn-google-signin');
  if(btn){
    btn.addEventListener('click', async ()=>{
      try{
        await signInWithGoogle();
        window.location.href = '/dashboard.html';
      }catch(err){
        console.error(err);
        alert('Gagal masuk');
      }
    });
  }
}
