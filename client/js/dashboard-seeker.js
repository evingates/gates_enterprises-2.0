document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const user = getUser();
  
  if (user && user.role !== 'seeker') {
    window.location.href = '/dashboard-employer.html';
    return;
  }
  
  if (user && user.full_name) {
    document.getElementById('userGreeting').innerText = `Welcome back, ${user.full_name}! Track your job applications here.`;
  }

  fetchApplications();
});

async function fetchApplications() {
  const tbody = document.getElementById('applicationsBody');
  const noMsg = document.getElementById('noAppsMsg');
  
  try {
    const response = await apiFetch('/applications/my');
    if (!response) return;
    
    const data = await response.json();
    if (data.success && data.applications.length > 0) {
      renderApplications(data.applications);
    } else {
      noMsg.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error fetching applications', err);
  }
}

function renderApplications(apps) {
  const tbody = document.getElementById('applicationsBody');
  
  tbody.innerHTML = apps.map(app => {
    let statusClass = 'status-applied';
    if (app.application_status === 'Interviewing') statusClass = 'status-interviewing';
    if (app.application_status === 'Offered') statusClass = 'status-offered';
    if (app.application_status === 'Rejected') statusClass = 'status-rejected';
    
    const date = new Date(app.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    
    return `
      <tr>
        <td style="font-weight: 600;">${app.job_title}</td>
        <td>${app.company_name}</td>
        <td class="text-muted">${date}</td>
        <td><span class="status-badge ${statusClass}">${app.application_status || 'pending'}</span></td>
      </tr>
    `;
  }).join('');
}
