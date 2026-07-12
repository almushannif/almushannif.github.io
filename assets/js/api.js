import { CONFIG } from './config.js';

/**
 * Generic fetch wrapper with timeout and JSON handling
 * @param {string} action query action for Apps Script
 * @param {object} opts additional fetch options (method, body)
 */
export async function callApi(action, opts = {}){
  const url = new URL(CONFIG.BASE_API_URL);
  url.searchParams.set('action', action);

  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), CONFIG.TIMEOUT);

  const fetchOpts = {
    method: opts.method || 'GET',
    headers: { 'Content-Type':'application/json' },
    signal: controller.signal
  };
  if(opts.body) fetchOpts.body = JSON.stringify(opts.body);

  try{
    const res = await fetch(url.toString(), fetchOpts);
    clearTimeout(id);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }catch(err){
    clearTimeout(id);
    console.error('API call failed', action, err);
    throw err;
  }
}
