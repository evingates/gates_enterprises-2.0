import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-brand-600 hover:text-brand-700 transition">
            <span className="bg-brand-600 text-white p-1 rounded font-bold text-xl"><Briefcase size={24}/></span>
            <span className="text-xl font-bold tracking-tight">Gates Enterprises</span>
          </Link>
          
          <div className="hidden md:ml-10 md:flex space-x-6">
            <Link to="/jobs" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Jobs</Link>
            {isAuthenticated && user?.role === 'seeker' && (
              <Link to="/seeker/applications" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">My Applications</Link>
            )}
            {isAuthenticated && user?.role === 'employer' && (
              <Link to="/employer/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">My Jobs</Link>
            )}
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Log In
              </Link>
              <Link to="/register/seeker" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium transition">
                Sign Up
              </Link>
            </>
          ) : (
            <>
                 {user?.role === 'employer' && (
                   <Link to="/employer/jobs/new" className="hidden md:block bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-700">
                     Post a Job
                   </Link>
                 )}
                 <div className="flex items-center divide-x divide-gray-200">
                   <Link 
                    to={user.role === 'employer' ? '/employer/profile' : '/seeker/profile'} 
                    className="px-4 text-sm font-medium text-gray-700 hover:text-brand-600">
                      {user.name || 'Profile'}
                   </Link>
                   <button onClick={handleLogout} className="px-4 text-sm font-medium text-gray-500 hover:text-gray-900">
                     Sign Out
                   </button>
                 </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
