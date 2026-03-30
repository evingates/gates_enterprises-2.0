import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const RegisterEmployerPage = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post('/auth/employer/register', formData);
      login(res.data.token, res.data.user);
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md card shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Join as an Employer</h2>
          <p className="text-sm text-gray-600 mt-1">Find the best talent for your company</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Company Name *</label>
            <input 
              type="text" 
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Work Email *</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password (8+ chars) *</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="input-field"
              required minLength={8}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full py-3 mt-4 text-base rounded-full ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Processing...' : 'Create Employer Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span>Already have an account? </span>
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployerPage;
