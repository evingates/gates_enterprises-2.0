import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';
import { Building } from 'lucide-react';

const CompanyProfilePage = () => {
  const { user, login } = useAuth();
  const { data, loading, error } = useFetch('/companies/me', { immediate: true });
  
  const [formData, setFormData] = useState({
    company_name: '', description: '', industry_type: '',
    headquarters_location: '', phone_number: '', website_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (data?.company) {
      const c = data.company;
      setFormData({
         company_name: c.company_name || '',
         description: c.description || '',
         industry_type: c.industry_type || '',
         headquarters_location: c.headquarters_location || '',
         phone_number: c.phone_number || '',
         website_url: c.website_url || ''
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const res = await axiosInstance.put('/companies/me', formData);
      setSaveSuccess(true);
      if (formData.company_name !== user.name) {
         login(localStorage.getItem('token'), { ...user, name: formData.company_name });
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="card shadow-md border-t-4 border-t-gray-800">
           <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
               <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
                   <Building size={32} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold">Company Profile</h1>
                  <p className="text-gray-500">Details visible to job seekers across Gates Enterprises.</p>
               </div>
           </div>

           {saveSuccess && <div className="bg-green-50 text-green-700 p-3 mb-4 rounded border border-green-200">Company details saved successfully!</div>}
           {saveError && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded border border-red-200">{saveError}</div>}

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Company Name *</label>
                    <input type="text" required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="input-field" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Website URL</label>
                    <input type="url" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="input-field" placeholder="https://example.com" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Industry</label>
                    <input type="text" value={formData.industry_type} onChange={e => setFormData({...formData, industry_type: e.target.value})} className="input-field" placeholder="e.g. Technology, Finance..." />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Headquarters</label>
                    <input type="text" value={formData.headquarters_location} onChange={e => setFormData({...formData, headquarters_location: e.target.value})} className="input-field" placeholder="City, Country" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-700">Company Phone</label>
                 <input type="tel" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="input-field max-w-sm" />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-700">Company Description</label>
                 <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="Describe your company's mission, culture, and what you do..." />
              </div>

              <div className="pt-4 flex justify-end">
                 <button type="submit" disabled={saving} className="btn-primary bg-gray-900 hover:bg-gray-800 focus:ring-gray-900 shadow-md">
                     {saving ? 'Saving...' : 'Save Details'}
                 </button>
              </div>
           </form>
       </div>
    </div>
  );
};

export default CompanyProfilePage;
