import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';
import { User } from 'lucide-react';

const SeekerProfilePage = () => {
  const { user, login } = useAuth();
  const { data, loading, error } = useFetch('/users/me', { immediate: true });
  
  const [formData, setFormData] = useState({
    full_name: '', phone_number: '', location_city: '',
    about_me: '', experience_summary: '', skills: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (data?.user) {
      const u = data.user;
      setFormData({
         full_name: u.full_name || '',
         phone_number: u.phone_number || '',
         location_city: u.location_city || '',
         about_me: u.about_me || '',
         experience_summary: u.experience_summary || '',
         skills: u.skills ? u.skills.join(', ') : ''
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const payload = { ...formData };
      payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const res = await axiosInstance.put('/users/me', payload);
      setSaveSuccess(true);
      // Update global context name if it changed
      if (payload.full_name !== user.name) {
         login(localStorage.getItem('token'), { ...user, name: payload.full_name });
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="card shadow-md">
           <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
               <div className="bg-brand-100 p-4 rounded-full text-brand-600">
                   <User size={32} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold">Your Profile</h1>
                  <p className="text-gray-500">Keep your details up to date to get matched with the best opportunities.</p>
               </div>
           </div>

           {saveSuccess && <div className="bg-green-50 text-green-700 p-3 mb-4 rounded border border-green-200">Profile saved successfully!</div>}
           {saveError && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded border border-red-200">{saveError}</div>}

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                    <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="input-field" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
                    <input type="tel" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="input-field" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-700">City / Location</label>
                 <input type="text" value={formData.location_city} onChange={e => setFormData({...formData, location_city: e.target.value})} className="input-field" placeholder="e.g. Nairobi, KE" />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-700">About Me</label>
                 <textarea rows={3} value={formData.about_me} onChange={e => setFormData({...formData, about_me: e.target.value})} className="input-field" placeholder="Write a short professional bio..." />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-700">Experience Summary</label>
                 <textarea rows={4} value={formData.experience_summary} onChange={e => setFormData({...formData, experience_summary: e.target.value})} className="input-field" placeholder="Summarize your past work experience..." />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-700">Skills (Comma Separated)</label>
                 <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="input-field" placeholder="e.g. React, Node.js, Project Management" />
                 <p className="text-xs text-brand-600 mt-1">Crucial for our skill-matching engine!</p>
              </div>

              <div className="pt-4 flex justify-end">
                 <button type="submit" disabled={saving} className="btn-primary flex items-center shadow-md">
                     {saving ? 'Saving...' : 'Save Profile'}
                 </button>
              </div>
           </form>
       </div>
    </div>
  );
};

export default SeekerProfilePage;
