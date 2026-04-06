document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect away
  if (isAuthenticated()) {
    const user = getUser();
    if (user && user.role === 'employer') {
      window.location.href = '/dashboard-employer.html';
    } else {
      window.location.href = '/jobs.html';
    }
  }

  const roleBtns = document.querySelectorAll('.role-btn');
  const loginForm = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMessage');
  let currentRole = 'seeker'; // default

  // Toggle roles
  roleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      roleBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentRole = e.target.getAttribute('data-role');
      // Hide error on role switch
      errorMsg.style.display = 'none';
    });
  });

  // Handle submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    errorMsg.style.display = 'none';

    try {
      const btn = loginForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Signing in...';
      btn.disabled = true;

      const endpoint = `/auth/${currentRole}/login`;
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      btn.innerText = originalText;
      btn.disabled = false;

      if (!response) {
        // already handled by network check
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAuth(data.token, data.user);
        // Redirect based on role
        if (data.user.role === 'employer') {
          window.location.href = '/dashboard-employer.html';
        } else {
          window.location.href = '/jobs.html';
        }
      } else {
        errorMsg.innerText = data.message || 'Login failed';
        errorMsg.style.display = 'block';
      }
    } catch (err) {
      console.error(err);
      errorMsg.innerText = 'An error occurred during login. Please try again.';
      errorMsg.style.display = 'block';
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.innerText = 'Sign In';
      btn.disabled = false;
    }
  });
});
