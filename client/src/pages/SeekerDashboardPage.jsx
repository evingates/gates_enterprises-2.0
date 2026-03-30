import React from 'react';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

const SeekerDashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error } = useFetch('/jobs/matched', { immediate: true });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      
      {/* Navigation & Mini Profile */}
      <div className="w-full md:w-1/4">
         <div className="card text-center relative overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-brand-300 to-brand-500 absolute w-full top-0 left-0 z-0"></div>
            <div className="relative z-10 pt-8">
                <div className="w-16 h-16 bg-white rounded-full mx-auto border-4 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-gray-400">
                    {user?.name?.[0]?.toUpperCase()}
                </div>
                <h2 className="mt-2 text-lg font-bold">{user?.name}</h2>
                <p className="text-sm text-gray-500">Job Seeker</p>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col space-y-2 text-sm text-left">
                <Link to="/seeker/profile" className="text-gray-600 hover:underline hover:text-brand-600">Update Profile</Link>
                <Link to="/seeker/applications" className="text-gray-600 hover:underline hover:text-brand-600">My Applications</Link>
            </div>
         </div>
      </div>

      {/* Recommended Jobs */}
      <div className="w-full md:w-3/4">
        <div className="card mb-4 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Recommended for you</h2>
            <p className="text-sm text-gray-600">Based on your skills and profile</p>
        </div>
        
        {loading && <div className="text-center py-10">Loading matches...</div>}
        {error && <div className="text-red-500">{error}</div>}
        
        {data?.jobs?.length === 0 && (
            <div className="card text-center py-12 text-gray-500">
               <p className="mb-4">We don't have enough data to recommend jobs to you yet.</p>
               <Link to="/seeker/profile" className="btn-primary inline-block">Add Skills to Profile</Link>
            </div>
        )}

        {data?.jobs?.map(job => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default SeekerDashboardPage;
