import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [role, setRole] = useState('seeker'); // 'seeker' or 'employer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = role === 'seeker' ? '/auth/seeker/login' : '/auth/employer/login';
      const res = await axiosInstance.post(endpoint, { email, password });
      
      login(res.data.token, res.data.user);
      navigate(role === 'seeker' ? '/seeker/dashboard' : '/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm card shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
          <p className="text-sm text-gray-600 mt-1">Stay updated on your professional world</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button 
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${role === 'seeker' ? 'bg-white shadow border border-gray-200' : 'text-gray-500'}`}
            onClick={() => setRole('seeker')}
          >
            Job Seeker
          </button>
          <button 
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${role === 'employer' ? 'bg-white shadow border border-gray-200' : 'text-gray-500'}`}
            onClick={() => setRole('employer')}
          >
            Employer
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field py-3 text-base"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field py-3 text-base"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full py-3 mt-4 text-base ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span>New to Gates Enterprises? </span>
          <Link to={`/register/${role}`} className="text-brand-600 font-semibold hover:underline">
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
