import React from 'react';

const ApplicationStatusBadge = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'Applied':
      colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
    case 'Under Review':
      colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'Interviewing':
      colorClass = 'bg-purple-100 text-purple-800 border-purple-200';
      break;
    case 'Offered':
      colorClass = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'Rejected':
      colorClass = 'bg-red-100 text-red-800 border-red-200';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded border text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};

export default ApplicationStatusBadge;
