/**
 * Small UI utilities (toasts, sanitizers)
 */

export function showToast(message, icon = 'success'){
  if(typeof Swal !== 'undefined'){
    Swal.fire({toast:true,position:'top-end',showConfirmButton:false,timer:3000,title:message,icon});
  }else{
    console.log('TOAST', icon, message);
  }
}

export function sanitizeText(str){
  if(typeof str !== 'string') return '';
  return str.replace(/[&<>"]+/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}
