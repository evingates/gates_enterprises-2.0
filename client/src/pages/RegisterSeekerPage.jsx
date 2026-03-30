import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const RegisterSeekerPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    id_number: '',
    phone_number: '',
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
      const res = await axiosInstance.post('/auth/seeker/register', formData);
      login(res.data.token, res.data.user);
      navigate('/seeker/dashboard');
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
          <h2 className="text-3xl font-bold text-gray-900">Join as a Seeker</h2>
          <p className="text-sm text-gray-600 mt-1">Make the most of your professional life</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name *</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email *</label>
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
          <div className="flex space-x-4">
            <div className="w-1/2">
                <label className="text-sm text-gray-600 mb-1 block">ID Number</label>
                <input 
                type="text" 
                value={formData.id_number}
                onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                className="input-field"
                />
            </div>
            <div className="w-1/2">
                <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                <input 
                type="tel" 
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                className="input-field"
                />
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 my-4">
            By clicking Agree & Join, you agree to the Gates Enterprises User Agreement, Privacy Policy, and Cookie Policy.
          </p>
          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full py-3 text-base rounded-full ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Processing...' : 'Agree & Join'}
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

export default RegisterSeekerPage;
