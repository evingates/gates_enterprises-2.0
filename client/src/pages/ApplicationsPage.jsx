import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import { ArrowLeft } from 'lucide-react';

const ApplicantRow = ({ app }) => {
  const [status, setStatus] = useState(app.application_status);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    try {
      await axiosInstance.patch(`/applications/${app.application_id}/status`, { application_status: newStatus });
    } catch (err) {
      alert('Failed to update status');
      setStatus(app.application_status); // Revert
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 py-4 last:border-0 hover:bg-gray-50 px-2 rounded transition">
       <div className="flex-1">
          <div className="font-semibold text-brand-700 text-lg">{app.full_name}</div>
          <div className="text-sm text-gray-600">{app.email} &middot; {app.phone_number || 'No phone'}</div>
          {app.location_city && <div className="text-xs text-gray-500">{app.location_city}</div>}
          <div className="mt-2 text-sm text-gray-700 max-w-2xl">{app.experience_summary || 'No summary provided.'}</div>
          <div className="mt-2 flex gap-1 flex-wrap">
              {app.skills && app.skills.map(skill => (
                  <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{skill}</span>
              ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">Applied: {new Date(app.created_at).toLocaleString()}</div>
       </div>

       <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-start sm:items-end w-48">
          <label className="text-xs text-gray-500 font-medium mb-1">Update Status</label>
          <select 
            value={status} 
            onChange={handleUpdate} 
            disabled={updating}
            className="input-field text-sm py-1.5 focus:ring-1 bg-white border outline-none"
          >
             <option value="Applied">Applied</option>
             <option value="Under Review">Under Review</option>
             <option value="Interviewing">Interviewing</option>
             <option value="Offered">Offered</option>
             <option value="Rejected">Rejected</option>
          </select>
          <div className="mt-2">
             <ApplicationStatusBadge status={status} />
          </div>
       </div>
    </div>
  );
};

const ApplicationsPage = () => {
  const { jobId } = useParams();
  const { data, loading, error } = useFetch(`/applications/job/${jobId}`, { immediate: true });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/employer/dashboard" className="text-gray-500 hover:text-brand-600 flex items-center mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>
      
      <div className="card shadow-md border-t-4 border-t-brand-600">
         <h1 className="text-2xl font-bold mb-1">Applicants Review</h1>
         <p className="text-gray-600 mb-6 border-b border-gray-200 pb-4">Manage candidate pipeline</p>

         {loading && <div className="p-8 text-center text-gray-500">Loading applications...</div>}
         {error && <div className="p-4 bg-red-50 text-red-500 rounded">{error}</div>}

         {!loading && data?.applications?.length === 0 && (
             <div className="text-center py-12 text-gray-500">No one has applied to this job yet.</div>
         )}

         <div className="flex flex-col">
            {data?.applications?.map(app => (
               <ApplicantRow key={app.application_id} app={app} />
            ))}
         </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
