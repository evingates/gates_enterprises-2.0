/**
 * Authentication utility functions
 */

function setAuth(token, user) {
  localStorage.setItem('gates_token', token);
  localStorage.setItem('gates_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('gates_token');
  localStorage.removeItem('gates_user');
}

function getUser() {
  const user = localStorage.getItem('gates_user');
  return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
  return !!localStorage.getItem('gates_token');
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
  }
}

function requireGuest() {
  if (isAuthenticated()) {
    window.location.href = '/jobs.html';
  }
}

window.logout = function() {
  clearAuth();
  window.location.href = '/login.html';
};
