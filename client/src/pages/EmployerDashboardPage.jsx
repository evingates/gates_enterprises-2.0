import React from 'react';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const EmployerDashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error } = useFetch('/jobs/employer/my', { immediate: true });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold">Employer Dashboard</h1>
           <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link to="/employer/jobs/new" className="mt-4 md:mt-0 btn-primary flex items-center">
            <Plus size={18} className="mr-1" /> Post a Job
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
          {/* Stats Bar */}
          <div className="w-full md:w-1/4 flex flex-col gap-4">
              <div className="card bg-brand-50 border-brand-100">
                  <h3 className="font-medium text-brand-800">Total Active Postings</h3>
                  <div className="text-3xl font-bold text-brand-600 mt-2">
                      {data?.jobs?.filter(j => j.is_active).length || 0}
                  </div>
              </div>
              <div className="card">
                <h3 className="font-semibold mb-3">Company Links</h3>
                <div className="flex flex-col space-y-2 text-sm">
                   <Link to="/employer/profile" className="text-brand-600 hover:underline">Edit Company Profile</Link>
                </div>
              </div>
          </div>

          <div className="w-full md:w-3/4">
             <h2 className="text-xl font-bold mb-4">Your Job Postings</h2>
             {loading && <div>Loading jobs...</div>}
             {error && <div className="text-red-500">{error}</div>}
             
             {data?.jobs?.length === 0 && (
                <div className="card text-center py-12">
                   <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
                   <Link to="/employer/jobs/new" className="text-brand-600 hover:underline">Post your first job</Link>
                </div>
             )}

             {data?.jobs?.map(job => (
                <JobCard key={job.job_id} job={job} isEmployerMode={true} />
             ))}
          </div>
      </div>
      
    </div>
  );
};

export default EmployerDashboardPage;
