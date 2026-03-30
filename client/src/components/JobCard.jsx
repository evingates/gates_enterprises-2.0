import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BriefcaseIcon, DollarSign } from 'lucide-react';

const JobCard = ({ job, isEmployerMode }) => (
  <div className="card hover:shadow-md transition mb-4 flex divide-x divide-gray-100">
    <div className="p-4 flex-1">
      <Link to={isEmployerMode ? `/employer/jobs/${job.job_id}/edit` : `/jobs/${job.job_id}`}>
        <h3 className="text-xl font-semibold text-brand-600 hover:underline">{job.job_title}</h3>
      </Link>
      <div className="text-gray-900 font-medium mb-1">{job.company_name}</div>
      <div className="flex flex-wrap text-sm text-gray-500 gap-4 mb-2">
         {job.location && <span className="flex items-center"><MapPin size={14} className="mr-1"/>{job.location}</span>}
         {job.experience_level_needed && <span className="flex items-center"><BriefcaseIcon size={14} className="mr-1"/>{job.experience_level_needed}</span>}
         {(job.salary_min || job.salary_max) && (
            <span className="flex items-center">
              <DollarSign size={14} className="mr-1"/>
              {job.salary_min ? `$${job.salary_min}` : ''} {job.salary_max ? `- $${job.salary_max}` : ''}
            </span>
         )}
         {job.skill_match_count !== undefined && (
            <span className="bg-green-100 text-green-800 px-2 rounded-full text-xs font-semibold flex items-center">
              ★ {job.skill_match_count} Skill Matches
            </span>
         )}
      </div>
      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
      
      {/* Skill Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {job.skills_required && job.skills_required.map(skill => (
           <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-sm border border-gray-200">{skill}</span>
        ))}
      </div>
    </div>
    
    <div className="p-4 w-32 flex flex-col items-center justify-center bg-gray-50 rounded-r-lg">
      <div className={`text-xs mb-2 whitespace-nowrap ${job.is_active === false ? 'text-red-600' : 'text-brand-700'}`}>
        {job.is_active === false ? 'Closed' : 'Active'}
      </div>
      {isEmployerMode ? (
         <div className="flex flex-col space-y-2">
            <Link to={`/employer/jobs/${job.job_id}/edit`} className="text-brand-600 border border-brand-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-brand-50 transition text-center">
              Edit
            </Link>
            <Link to={`/employer/jobs/${job.job_id}/applications`} className="text-gray-600 hover:text-brand-600 text-sm font-medium text-center">
              View Applicants
            </Link>
         </div>
      ) : (
         <Link to={`/jobs/${job.job_id}`} className="text-brand-600 border border-brand-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-brand-50 transition">
           View
         </Link>
      )}
    </div>
  </div>
);

export default JobCard;
