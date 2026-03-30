import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';

const SeekerApplicationsPage = () => {
  const { data, loading, error } = useFetch('/applications/my', { immediate: true });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">My Applications</h1>
      
      {loading && <div className="text-center p-8">Loading applications...</div>}
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      
      {!loading && data?.applications?.length === 0 && (
        <div className="card text-center py-16">
           <h3 className="text-xl font-semibold mb-2">You haven't applied to any jobs yet</h3>
           <p className="text-gray-600 mb-6">Discover great opportunities waiting for you.</p>
           <Link to="/jobs" className="btn-primary">Search Jobs</Link>
        </div>
      )}

      <div className="space-y-4">
        {data?.applications?.map(app => (
          <div key={app.application_id} className="card hover:shadow-md transition">
             <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                   <Link to={`/jobs/${app.job_id}`} className="text-xl font-semibold text-brand-600 hover:underline">
                      {app.job_title}
                   </Link>
                   <div className="text-gray-800 font-medium text-sm mt-1">{app.company_name} &middot; {app.location || 'Remote'}</div>
                   <div className="text-xs text-gray-500 mt-2">Applied on {new Date(app.created_at).toLocaleDateString()}</div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                   <div className="text-sm text-gray-600 font-medium mb-1">Status</div>
                   <ApplicationStatusBadge status={app.application_status} />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeekerApplicationsPage;
