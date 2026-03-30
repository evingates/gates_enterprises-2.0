import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ArrowLeft } from 'lucide-react';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    salary_min: '',
    salary_max: '',
    location: '',
    experience_level_needed: 'Entry',
    skills_required: '', // Will split by comma
    application_method: 'Internal',
    deadline_date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData };
      payload.salary_min = payload.salary_min ? parseInt(payload.salary_min) : null;
      payload.salary_max = payload.salary_max ? parseInt(payload.salary_max) : null;
      payload.skills_required = payload.skills_required.split(',').map(s => s.trim()).filter(s => s);
      payload.deadline_date = payload.deadline_date || null;

      if (payload.experience_level_needed === '') payload.experience_level_needed = null;

      await axiosInstance.post('/jobs', payload);
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/employer/dashboard" className="text-gray-500 hover:text-brand-600 flex items-center mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title *</label>
            <input type="text" required value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="input-field" placeholder="e.g. Senior Software Engineer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea required rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="Describe the role, responsibilities, and requirements..." />
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Minimum Salary (USD)</label>
                <input type="number" min="0" value={formData.salary_min} onChange={e => setFormData({...formData, salary_min: e.target.value})} className="input-field" placeholder="e.g. 50000" />
             </div>
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Maximum Salary (USD)</label>
                <input type="number" min="0" value={formData.salary_max} onChange={e => setFormData({...formData, salary_max: e.target.value})} className="input-field" placeholder="e.g. 80000" />
             </div>
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="e.g. New York, NY (or Remote)" />
             </div>
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Experience Level</label>
                <select value={formData.experience_level_needed} onChange={e => setFormData({...formData, experience_level_needed: e.target.value})} className="input-field">
                   <option value="Entry">Entry</option>
                   <option value="Mid">Mid</option>
                   <option value="Senior">Senior</option>
                </select>
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium mb-1">Required Skills (comma separated)</label>
             <input type="text" value={formData.skills_required} onChange={e => setFormData({...formData, skills_required: e.target.value})} className="input-field" placeholder="e.g. React, Node.js, SQL" />
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input type="date" value={formData.deadline_date} onChange={e => setFormData({...formData, deadline_date: e.target.value})} className="input-field" />
             </div>
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Application Method</label>
                <select value={formData.application_method} onChange={e => setFormData({...formData, application_method: e.target.value})} className="input-field">
                   <option value="Internal">Internal (JobLinker Apply)</option>
                   <option value="External">External System (Future)</option>
                </select>
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Posting...' : 'Post Job'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostJobPage;
