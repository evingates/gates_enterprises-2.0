import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
      <h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops! Page not found.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );
};

export default NotFoundPage;
