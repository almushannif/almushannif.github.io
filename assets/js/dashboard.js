import { callApi } from './api.js';
import { showToast } from './utils.js';

// Initialize dashboard charts and fetch data
export async function initDashboard(){
  try{
    // Fetch summary from API (action=dashboard)
    // const data = await callApi('dashboard');
    // For scaffold we use dummy data
    const data = { santri:120, guru:12, alumni:45, donasi:15000000 };

    const ctx = document.getElementById('chart-stats');
    if(ctx){
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Santri','Guru','Alumni','Donasi'],
          datasets:[{data:[data.santri,data.guru,data.alumni,Math.round(data.donasi/1000000)],backgroundColor:['#0B6E4F','#198754','#FFC107','#6c757d']}]
        }
      });
    }

    // render summary cards
    const container = document.getElementById('summary-cards');
    if(container){
      container.innerHTML = `
        <div class="summary-item"> <strong>Santri</strong><span>${data.santri}</span></div>
        <div class="summary-item"> <strong>Guru</strong><span>${data.guru}</span></div>
        <div class="summary-item"> <strong>Alumni</strong><span>${data.alumni}</span></div>
        <div class="summary-item"> <strong>Donasi (Rp)</strong><span>${data.donasi.toLocaleString('id-ID')}</span></div>
      `;
    }

  }catch(err){
    console.error('Failed to init dashboard', err);
    showToast('Gagal memuat dashboard', 'error');
  }
}

// Auto init if included on dashboard page
if(typeof window !== 'undefined' && document.body.classList.contains('dashboard')){
  initDashboard();
}
