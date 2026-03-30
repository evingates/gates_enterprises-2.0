import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center">
        
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Find the right job or internship for you, <span className="text-brand-600">faster.</span>
          </h1>
          <p className="text-xl text-gray-600">
            Welcome to the new standard in professional networking by Gates Enterprises. Find opportunities that match your precise skills.
          </p>
          <div className="pt-4 flex space-x-4">
            <Link to="/jobs" className="btn-primary text-lg">
              Find Jobs
            </Link>
            <Link to="/register/employer" className="btn-secondary text-lg">
              Post a Job
            </Link>
          </div>
        </div>
        
        {/* Right Image Placeholder (Could use generate_image ideally, but let's use a standard gradient box for now) */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="w-96 h-96 bg-gradient-to-br from-brand-100 to-brand-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-brand-800 text-3xl font-bold">Gates Enterprises</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
