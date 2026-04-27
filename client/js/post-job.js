const skills = [];

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const user = getUser();

  // Only employers should access this page
  if (user && user.role !== 'employer') {
    window.location.href = '/dashboard-seeker.html';
    return;
  }

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', function () {
    clearAuth();
    window.location.href = '/login.html';
  });

  // Skill tag management
  const skillInput = document.getElementById('skillInput');
  const addSkillBtn = document.getElementById('addSkillBtn');

  function addSkill() {
    const val = skillInput.value.trim();
    if (!val || skills.includes(val)) {
      skillInput.value = '';
      return;
    }
    skills.push(val);
    renderSkills();
    skillInput.value = '';
  }

  addSkillBtn.addEventListener('click', addSkill);
  skillInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  });

  // Form submission
  document.getElementById('postJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitJob();
  });
});

function renderSkills() {
  const container = document.getElementById('skillsContainer');
  container.innerHTML = skills.map((skill, i) => `
    <span class="skill-tag">
      ${skill}
      <button type="button" onclick="removeSkill(${i})" title="Remove">&times;</button>
    </span>
  `).join('');
}

function removeSkill(index) {
  skills.splice(index, 1);
  renderSkills();
}

function showAlert(message, type = 'error') {
  const box = document.getElementById('alertBox');
  box.textContent = message;
  box.className = `alert alert-${type}`;
  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideAlert() {
  const box = document.getElementById('alertBox');
  box.style.display = 'none';
}

async function submitJob() {
  hideAlert();

  const title = document.getElementById('job_title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title) { showAlert('Job title is required.'); return; }
  if (!description) { showAlert('Job description is required.'); return; }

  const salaryMin = document.getElementById('salary_min').value;
  const salaryMax = document.getElementById('salary_max').value;

  if (salaryMin && salaryMax && parseInt(salaryMax) < parseInt(salaryMin)) {
    showAlert('Maximum salary must be greater than or equal to minimum salary.');
    return;
  }

  const payload = {
    job_title: title,
    description,
    location: document.getElementById('location').value.trim() || null,
    experience_level_needed: document.getElementById('experience_level_needed').value || null,
    salary_min: salaryMin ? parseInt(salaryMin) : null,
    salary_max: salaryMax ? parseInt(salaryMax) : null,
    skills_required: skills.length > 0 ? skills : null,
    application_method: document.getElementById('application_method').value.trim() || null,
    deadline_date: document.getElementById('deadline_date').value || null,
  };

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Posting...';

  try {
    const response = await apiFetch('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response) return; // 401 handled by apiFetch

    const data = await response.json();

    if (data.success) {
      showAlert('Job posted successfully! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard-employer.html';
      }, 1800);
    } else {
      showAlert(data.message || 'Failed to post job. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Job';
    }
  } catch (err) {
    console.error(err);
    showAlert('A network error occurred. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Post Job';
  }
}
