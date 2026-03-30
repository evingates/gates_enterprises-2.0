import { useState, useMemo } from 'react';

const useJobFilters = () => {
  const [filters, setFilters] = useState({
    location: '',
    experience_level: '',
    skills: '', // comma separated string or search keyword
  });

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: '', experience_level: '', skills: '' });
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.experience_level) params.append('experience_level', filters.experience_level);
    if (filters.skills) params.append('skills', filters.skills);
    return params.toString();
  }, [filters]);

  return { filters, updateFilter, clearFilters, queryString };
};

export default useJobFilters;
