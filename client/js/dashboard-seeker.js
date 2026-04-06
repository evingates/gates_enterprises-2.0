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
    if (app.status === 'Interviewing') statusClass = 'status-interviewing';
    if (app.status === 'Offered') statusClass = 'status-offered';
    if (app.status === 'Rejected') statusClass = 'status-rejected';
    
    const date = new Date(app.applied_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    
    return `
      <tr>
        <td style="font-weight: 600;">${app.job_title}</td>
        <td>${app.company_name}</td>
        <td class="text-muted">${date}</td>
        <td><span class="status-badge ${statusClass}">${app.status || 'Applied'}</span></td>
      </tr>
    `;
  }).join('');
}
