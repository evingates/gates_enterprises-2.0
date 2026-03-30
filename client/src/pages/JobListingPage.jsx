import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useJobFilters from '../hooks/useJobFilters';
import { MapPin, Search } from 'lucide-react';
import JobCard from '../components/JobCard';

const JobListingPage = () => {
  const { filters, updateFilter, queryString, clearFilters } = useJobFilters();
  const { data, loading, error, execute } = useFetch(`/jobs?${queryString}`, { immediate: false });

  // Add delay to prevent spamming
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      execute();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [queryString, execute]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
             <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search skills, keywords..." 
                  className="input-field pl-10"
                  value={filters.skills}
                  onChange={(e) => updateFilter('skills', e.target.value)}
                />
             </div>
             <div className="flex-1 relative">
                <MapPin size={20} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="City, state, or zip code" 
                  className="input-field pl-10"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
             </div>
             <div>
                <select 
                  className="input-field py-2.5"
                  value={filters.experience_level}
                  onChange={(e) => updateFilter('experience_level', e.target.value)}
                >
                  <option value="">Any Experience</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex">
         {/* Left col - Jobs List */}
         <div className="w-full xl:w-2/3 pr-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
               {loading ? 'Searching...' : `Job results`}
            </h2>
            
            {error && <div className="text-red-600 mb-4">{error}</div>}
            
            {loading && !data && <div className="text-center py-10">Loading jobs...</div>}
            
            {!loading && data?.jobs?.length === 0 && (
              <div className="card text-center py-10">
                <p className="text-gray-500">No jobs found matching your criteria.</p>
                <button onClick={clearFilters} className="mt-4 text-brand-600 hover:underline">Clear filters</button>
              </div>
            )}

            {data?.jobs?.map(job => (
              <JobCard key={job.job_id} job={job} />
            ))}
         </div>

         {/* Right col - generic stuff or preview pane */}
         <div className="hidden xl:block w-1/3 pl-4">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-lg mb-2">Gates Enterprises Job Search</h3>
              <p className="text-sm text-gray-600">
                 Find the most relevant opportunities. We actively track company postings to bring you exactly what you're looking for.
              </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default JobListingPage;
