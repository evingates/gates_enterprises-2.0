import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';
import { MapPin, BriefcaseIcon, DollarSign, Building } from 'lucide-react';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useFetch(`/jobs/${jobId}`, { immediate: true });
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const handleApply = async () => {
    if (!user) {
        setApplyError('Please log in as a job seeker to apply.');
        return;
    }
    setApplying(true);
    setApplyError('');
    try {
        await axiosInstance.post('/applications', { job_id: jobId });
        setApplySuccess(true);
    } catch (err) {
        setApplyError(err.response?.data?.message || 'Failed to apply');
    } finally {
        setApplying(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!data?.job) return null;

  const { job } = data;

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
         {/* Main content */}
         <div className="w-full md:w-2/3 space-y-4">
             <div className="card">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{job.job_title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 gap-2 sm:gap-4 mb-6">
                    <span className="flex items-center text-brand-700 font-medium"><Building size={16} className="mr-1"/> {job.company_name}</span>
                    {job.location && <span className="flex items-center"><MapPin size={16} className="mr-1"/> {job.location}</span>}
                    <span className="text-sm">Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 border-y border-gray-100 py-4 mb-6">
                    {job.experience_level_needed && (
                       <div className="flex items-center text-gray-700">
                          <BriefcaseIcon size={20} className="text-gray-400 mr-2"/>
                          <div>
                            <div className="text-xs text-gray-500 uppercase">Experience</div>
                            <div className="font-medium">{job.experience_level_needed}</div>
                          </div>
                       </div>
                    )}
                    {(job.salary_min || job.salary_max) && (
                       <div className="flex items-center text-gray-700">
                          <DollarSign size={20} className="text-gray-400 mr-2"/>
                          <div>
                             <div className="text-xs text-gray-500 uppercase">Salary Range</div>
                             <div className="font-medium">{job.salary_min ? `$${job.salary_min}` : ''} {job.salary_max ? `- $${job.salary_max}` : ''}</div>
                          </div>
                       </div>
                    )}
                </div>

                <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                    <h2 className="text-xl font-semibold mb-2">About the role</h2>
                    {job.description}
                </div>
                
                {job.skills_required && job.skills_required.length > 0 && (
                  <div className="mt-8">
                     <h2 className="text-lg font-semibold mb-3">Skills Required</h2>
                     <div className="flex flex-wrap gap-2">
                        {job.skills_required.map(skill => (
                           <span key={skill} className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                        ))}
                     </div>
                  </div>
                )}
             </div>
         </div>

         {/* Right Sidebar */}
         <div className="w-full md:w-1/3 space-y-4">
            <div className="card sticky top-24 border-t-4 border-t-brand-600">
               {applyError && <div className="bg-red-50 text-red-600 p-2 text-sm rounded mb-4">{applyError}</div>}
               {applySuccess ? (
                  <div className="bg-green-50 justify-center text-green-700 p-4 border border-green-200 rounded-lg flex flex-col items-center">
                     <div className="text-lg font-bold mb-2">Application Submitted!</div>
                     <p className="text-sm mb-4 text-center">The employer will review your profile shortly.</p>
                     <Link to="/seeker/applications" className="text-brand-600 hover:underline text-sm font-semibold">View My Applications</Link>
                  </div>
               ) : (
                  <>
                     <h3 className="text-lg font-bold mb-4">Interested in this job?</h3>
                     {(!user || user.role === 'seeker') && (
                         <button 
                           onClick={handleApply} 
                           disabled={applying || !job.is_active}
                           className={`w-full py-3 rounded-full font-semibold text-white transition ${!job.is_active ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-md'}`}
                         >
                            {applying ? 'Applying...' : (!job.is_active ? 'Closed' : 'Easy Apply')}
                         </button>
                     )}
                     {user?.role === 'employer' && (
                         <div className="bg-yellow-50 text-yellow-800 p-3 text-sm rounded border border-yellow-200">
                            Employers cannot apply for jobs.
                         </div>
                     )}
                     <p className="text-xs text-gray-500 mt-4 text-center">
                        Applying means you share your Gates Enterprises profile with {job.company_name}.
                     </p>
                  </>
               )}
            </div>

            <div className="card">
               <h3 className="font-semibold mb-2">About the Company</h3>
               <p className="font-bold text-lg mb-1">{job.company_name}</p>
               <div className="text-sm text-gray-600 mb-2">{job.industry_type || 'Industry not specified'}</div>
               {job.headquarters_location && <div className="text-sm text-gray-600 flex items-center mb-3"><MapPin size={14} className="mr-1"/> {job.headquarters_location}</div>}
               <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">{job.company_desc}</p>
               {job.website_url && (
                  <a href={job.website_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-brand-600 hover:underline text-sm font-medium">Visit Website</a>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
export default JobDetailPage;
