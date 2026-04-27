document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const user = getUser();
  
  if (user && user.role !== 'employer') {
    window.location.href = '/dashboard-seeker.html';
    return;
  }
  
  if (user && user.title) {
    document.getElementById('employerGreeting').innerText = `Manage your postings for ${user.company_name || 'your company'}.`;
  }

  fetchMyJobs();
});

async function fetchMyJobs() {
  const jobsList = document.getElementById('jobsList');
  const noJobsMsg = document.getElementById('noJobsMsg');
  
  try {
    const response = await apiFetch('/jobs/my');
    if (!response) return;
    
    const data = await response.json();
    if (data.success && data.jobs.length > 0) {
      renderJobs(data.jobs);
    } else {
      noJobsMsg.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error fetching jobs', err);
  }
}

function renderJobs(jobs) {
  const jobsList = document.getElementById('jobsList');
  
  jobsList.innerHTML = jobs.map((job, index) => {
    return `
      <div class="job-item ${index === 0 ? 'active' : ''}" onclick="selectJob(${job.job_id}, '${escapeQuote(job.job_title)}', this)">
        <div>
          <div class="job-item-title">${job.job_title}</div>
          <div class="text-muted" style="font-size: 13px;">${job.location} • ${job.experience_level_needed}</div>
        </div>
        <div>
          <span class="badge ${job.is_active ? 'badge-ft' : 'badge-entry'}">${job.is_active ? 'Active' : 'Closed'}</span>
        </div>
      </div>
    `;
  }).join('');
  
  // Auto-select first job
  if (jobs.length > 0) {
    selectJob(jobs[0].job_id, jobs[0].job_title, jobsList.querySelector('.job-item'));
  }
}

function escapeQuote(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

async function selectJob(jobId, jobTitle, element) {
  // Update active styling
  document.querySelectorAll('.job-item').forEach(el => el.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }
  
  document.getElementById('selectJobPrompt').style.display = 'none';
  document.getElementById('applicantsPanel').style.display = 'block';
  document.getElementById('selectedJobTitle').innerText = jobTitle || 'this job';
  
  fetchApplicants(jobId);
}

async function fetchApplicants(jobId) {
  const tbody = document.getElementById('applicantsBody');
  const noAppsMsg = document.getElementById('noAppsMsg');
  
  tbody.innerHTML = '<tr><td colspan="4" class="text-center">Loading...</td></tr>';
  noAppsMsg.classList.add('hidden');
  
  try {
    const response = await apiFetch(`/applications/job/${jobId}`);
    if (!response) return;
    
    const data = await response.json();
    console.log('[Applicants] Server response:', data, '| Status:', response.status);

    if (data.success && data.applications.length > 0) {
      renderApplicants(data.applications, jobId);
    } else if (data.success) {
      tbody.innerHTML = '';
      noAppsMsg.innerText = 'No applicants yet.';
      noAppsMsg.classList.remove('hidden');
    } else {
      tbody.innerHTML = '';
      noAppsMsg.innerText = `Error: ${data.message || JSON.stringify(data)}`;
      noAppsMsg.classList.remove('hidden');
      console.error('[Applicants] Server error:', data);
    }
  } catch (err) {
    console.error('[Applicants] Network error:', err);
    tbody.innerHTML = '';
    noAppsMsg.innerText = 'Network error loading applicants.';
    noAppsMsg.classList.remove('hidden');
  }
}

function renderApplicants(apps, jobId) {
  const tbody = document.getElementById('applicantsBody');
  const statuses = ['pending', 'Applied', 'Under Review', 'Interviewing', 'Offered', 'Approved', 'Rejected'];
  
  tbody.innerHTML = apps.map(app => {
    
    const options = statuses.map(s => {
      const selected = app.application_status === s ? 'selected' : '';
      return `<option value="${s}" ${selected}>${s}</option>`;
    }).join('');
    
    return `
      <tr>
        <td style="font-weight: 500;">${app.full_name}</td>
        <td>${app.email}</td>
        <td>
          <span class="badge ${getStatusBadgeClass(app.application_status)}">${app.application_status}</span>
        </td>
        <td>
          <select class="status-select" onchange="updateStatus('${app.application_id}', this.value, '${jobId}')">
            ${options}
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadgeClass(status) {
  if (status === 'Interviewing') return 'badge-entry';
  if (status === 'Offered')      return 'badge-ft';
  if (status === 'Approved')     return 'badge-ft';
  if (status === 'Rejected')     return '';
  if (status === 'Under Review') return 'badge-remote';
  return 'badge-remote'; // pending / Applied
}

async function updateStatus(appId, newStatus, jobId) {
  try {
    const response = await apiFetch(`/applications/${appId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ application_status: newStatus })
    });
    
    if (response && response.ok) {
      // Refresh the applicants list
      fetchApplicants(jobId);
    } else {
      alert("Failed to update status");
    }
  } catch (e) {
    console.error(e);
  }
}
