const API_BASE_URL = '/api';

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
