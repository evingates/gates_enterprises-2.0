const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost 
  ? 'http://localhost:5000/api'
  : 'https://gates-enterprises-api.onrender.com/api'; // Placeholder for production URL

/**
 * Core fetch wrapper that automatically adds the JWT token
 * and handles base URL resolution.
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('gates_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized, clear token and handle redirect
  if (response.status === 401) {
    localStorage.removeItem('gates_token');
    localStorage.removeItem('gates_user');
    window.location.href = '/login.html';
    return null;
  }

  return response;
}
