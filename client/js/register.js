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
  const registerForm = document.getElementById('registerForm');
  const errorMsg = document.getElementById('errorMessage');
  
  const seekerFields = document.getElementById('seekerFields');
  const employerFields = document.getElementById('employerFields');
  
  let currentRole = 'seeker'; // default

  // Toggle roles
  roleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      roleBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentRole = e.target.getAttribute('data-role');
      
      // Toggle field visibility
      if (currentRole === 'seeker') {
        seekerFields.classList.remove('hidden');
        employerFields.classList.add('hidden');
      } else {
        seekerFields.classList.add('hidden');
        employerFields.classList.remove('hidden');
      }
      
      // Hide error on role switch
      errorMsg.style.display = 'none';
    });
  });

  // Handle submit
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    errorMsg.style.display = 'none';

    let bodyData = { email, password };
    
    if (currentRole === 'seeker') {
      bodyData.full_name = document.getElementById('fullName').value;
      bodyData.id_number = document.getElementById('idNumber').value;
      bodyData.phone_number = document.getElementById('phoneNumber').value;
    } else {
      bodyData.company_name = document.getElementById('companyName').value;
    }

    try {
      const btn = registerForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Signing up...';
      btn.disabled = true;

      const endpoint = `/auth/${currentRole}/register`;
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(bodyData)
      });

      btn.innerText = originalText;
      btn.disabled = false;

      if (!response) return;

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
        errorMsg.innerText = data.message || 'Registration failed';
        errorMsg.style.display = 'block';
      }
    } catch (err) {
      console.error(err);
      errorMsg.innerText = 'An error occurred during registration. Please try again.';
      errorMsg.style.display = 'block';
      const btn = registerForm.querySelector('button[type="submit"]');
      btn.innerText = 'Sign Up';
      btn.disabled = false;
    }
  });
});
