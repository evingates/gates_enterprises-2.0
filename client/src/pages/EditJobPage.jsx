import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ArrowLeft } from 'lucide-react';
import useFetch from '../hooks/useFetch';

const EditJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState('');
  
  const { data, loading, error } = useFetch(`/jobs/${jobId}`, { immediate: true });
  
  const [formData, setFormData] = useState({
    job_title: '', description: '', salary_min: '', salary_max: '',
    location: '', experience_level_needed: 'Entry', skills_required: '',
    application_method: 'Internal', deadline_date: '', is_active: true
  });

  useEffect(() => {
    if (data?.job) {
       const j = data.job;
       setFormData({
          job_title: j.job_title || '',
          description: j.description || '',
          salary_min: j.salary_min || '',
          salary_max: j.salary_max || '',
          location: j.location || '',
          experience_level_needed: j.experience_level_needed || 'Entry',
          skills_required: j.skills_required ? j.skills_required.join(', ') : '',
          application_method: j.application_method || 'Internal',
          deadline_date: j.deadline_date ? j.deadline_date.substring(0, 10) : '',
          is_active: j.is_active
       });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setErrorUpdate('');
    try {
      const payload = { ...formData };
      payload.salary_min = payload.salary_min ? parseInt(payload.salary_min) : null;
      payload.salary_max = payload.salary_max ? parseInt(payload.salary_max) : null;
      payload.skills_required = payload.skills_required.split(',').map(s => s.trim()).filter(s => s);
      payload.deadline_date = payload.deadline_date || null;
      delete payload.is_active;

      if (payload.experience_level_needed === '') payload.experience_level_needed = null;

      await axiosInstance.put(`/jobs/${jobId}`, payload);
      navigate('/employer/dashboard');
    } catch (err) {
      setErrorUpdate(err.response?.data?.message || err.response?.data?.errors?.join(', ') || err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleToggleStatus = async () => {
      try {
          await axiosInstance.patch(`/jobs/${jobId}/toggle`);
          setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
      } catch(err) {
          alert('Failed to toggle status');
      }
  };

  if (loading) return <div className="p-8 text-center">Loading job...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/employer/dashboard" className="text-gray-500 hover:text-brand-600 flex items-center mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Job: {data?.job?.job_title}</h1>
            <button onClick={handleToggleStatus} className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${formData.is_active ? 'border-red-600 text-red-600 hover:bg-red-50' : 'border-green-600 text-green-600 hover:bg-green-50'}`}>
                {formData.is_active ? 'Close Job' : 'Reopen Job'}
            </button>
        </div>
        
        {errorUpdate && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{errorUpdate}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same fields as create form ideally extracted, but duplicating for brevity */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Title *</label>
            <input type="text" required value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea required rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" />
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Minimum Salary</label>
                <input type="number" min="0" value={formData.salary_min} onChange={e => setFormData({...formData, salary_min: e.target.value})} className="input-field" />
             </div>
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Maximum Salary</label>
                <input type="number" min="0" value={formData.salary_max} onChange={e => setFormData({...formData, salary_max: e.target.value})} className="input-field" />
             </div>
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-field" />
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
             <input type="text" value={formData.skills_required} onChange={e => setFormData({...formData, skills_required: e.target.value})} className="input-field" />
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input type="date" value={formData.deadline_date} onChange={e => setFormData({...formData, deadline_date: e.target.value})} className="input-field" />
             </div>
             <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Application Method</label>
                <select value={formData.application_method} onChange={e => setFormData({...formData, application_method: e.target.value})} className="input-field">
                   <option value="Internal">Internal (JobLinker)</option>
                   <option value="External">External System</option>
                </select>
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button type="submit" disabled={loadingUpdate} className="btn-primary">
                {loadingUpdate ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditJobPage;
