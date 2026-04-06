let allJobs = [];

document.addEventListener('DOMContentLoaded', () => {
  setupNavbarAuth();
  setupFilters();
  fetchJobs();
});

function setupNavbarAuth() {
  const authSection = document.getElementById('navAuthSection');
  if (isAuthenticated()) {
    const user = getUser();
    const dashLink = user.role === 'employer' ? '/dashboard-employer.html' : '/dashboard-seeker.html';
    authSection.innerHTML = `
      <div style="display: flex; gap: 16px; align-items: center;">
        <a href="${dashLink}" style="color: var(--text-dark); font-weight: 500; text-decoration: none;">Dashboard</a>
        <button onclick="logout()" class="btn btn-outline" style="padding: 6px 12px; font-size: 13px;">Log Out</button>
      </div>
    `;
  } else {
    authSection.innerHTML = `
      <div style="display: flex; gap: 16px; align-items: center;">
        <a href="/login.html" style="color: var(--text-dark); font-weight: 500; text-decoration: none;">Log in</a>
        <a href="/register.html" class="btn btn-primary">Sign up</a>
      </div>
    `;
  }
}

async function fetchJobs() {
  const spinner = document.getElementById('jobsSpinner');
  const grid = document.getElementById('jobsGrid');
  const noJobsMsg = document.getElementById('noJobsMsg');
  
  try {
    const response = await apiFetch('/jobs');
    if (!response) return;
    
    const data = await response.json();
    if (data.success) {
      allJobs = data.jobs;
      renderJobs(allJobs);
    }
  } catch (err) {
    console.error('Failed to fetch jobs', err);
  } finally {
    spinner.style.display = 'none';
  }
}

function renderJobs(jobs) {
  const grid = document.getElementById('jobsGrid');
  const noJobsMsg = document.getElementById('noJobsMsg');
  const countTitle = document.getElementById('jobsCountTitle');
  
  countTitle.innerText = `${jobs.length} Jobs Found`;
  
  if (jobs.length === 0) {
    grid.style.display = 'none';
    noJobsMsg.classList.remove('hidden');
    return;
  }
  
  grid.style.display = 'grid';
  noJobsMsg.classList.add('hidden');
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  grid.innerHTML = jobs.map(job => {
    const avatarLetter = job.company_name ? job.company_name.charAt(0).toUpperCase() : 'C';
    const salaryText = job.salary_min && job.salary_max 
      ? `${formatter.format(job.salary_min)} - ${formatter.format(job.salary_max)}` 
      : 'Competitive';
      
    // Randomize some badges just for UI mock appeal
    const isRemote = job.location && job.location.toLowerCase().includes('remote');
    const remoteBadge = isRemote ? `<span class="badge badge-remote">Remote</span>` : '';
    
    let levelBadgeClass = 'badge-ft';
    if (job.experience_level_needed === 'Entry Level') levelBadgeClass = 'badge-entry';
    if (job.experience_level_needed === 'Expert') levelBadgeClass = 'badge-expert';
    
    return `
      <div class="card flex-col">
        <div class="card-header">
          <div class="company-avatar">${avatarLetter}</div>
          <div>
            <h3 class="job-title">${job.job_title}</h3>
            <div class="company-name">${job.company_name} • ${job.location || 'Anywhere'}</div>
          </div>
        </div>
        
        <div class="badges-row">
          <span class="badge ${levelBadgeClass}">${job.experience_level_needed || 'Full-Time'}</span>
          ${remoteBadge}
        </div>
        
        <p class="job-desc">${job.description || 'No description provided.'}</p>
        
        <div class="card-footer">
          <span class="job-salary">${salaryText}</span>
          <button class="btn btn-primary" onclick="applyForJob(${job.job_id})" style="padding: 8px 16px;">Apply</button>
        </div>
      </div>
    `;
  }).join('');
}

function applyForJob(jobId) {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return;
  }
  
  const user = getUser();
  if (user && user.role === 'employer') {
    alert("Employers cannot apply for jobs.");
    return;
  }
  
  // Fake apply request for now
  apiFetch('/applications', {
    method: 'POST',
    body: JSON.stringify({ job_id: jobId })
  }).then(res => res.json()).then(data => {
    if (data.success) {
      alert("Successfully applied for the job!");
    } else {
      alert(data.message || "Could not apply. You might have applied already.");
    }
  }).catch(e => {
    console.error(e);
    alert("Application error.");
  });
}

function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const locationInput = document.getElementById('locationInput');
  const searchBtn = document.getElementById('searchBtn');
  
  const checkboxes = document.querySelectorAll('.filter-cb');
  const slider = document.getElementById('salaryFilter');
  const sliderValDisplay = document.getElementById('salaryValDisplay');
  
  const applyFilters = () => {
    const term = searchInput.value.toLowerCase();
    const loc = locationInput.value.toLowerCase();
    const minSalary = parseInt(slider.value, 10);
    
    const activeLevels = Array.from(checkboxes)
      .filter(cb => cb.checked && cb.dataset.type === 'level')
      .map(cb => cb.value);
      
    const filtered = allJobs.filter(job => {
      const matchTerm = job.job_title.toLowerCase().includes(term) || (job.company_name && job.company_name.toLowerCase().includes(term));
      const matchLoc = !loc || (job.location && job.location.toLowerCase().includes(loc));
      const matchSalary = !minSalary || (job.salary_max >= minSalary || job.salary_min >= minSalary);
      const matchLevel = activeLevels.length === 0 || activeLevels.includes(job.experience_level_needed);
      
      return matchTerm && matchLoc && matchSalary && matchLevel;
    });
    
    renderJobs(filtered);
  };
  
  searchBtn.addEventListener('click', applyFilters);
  searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') applyFilters(); });
  locationInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') applyFilters(); });
  
  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  
  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (val === 0) {
      sliderValDisplay.innerText = 'Any';
    } else {
      sliderValDisplay.innerText = '$' + (val / 1000) + 'k+';
    }
  });
  
  slider.addEventListener('change', applyFilters);
}
