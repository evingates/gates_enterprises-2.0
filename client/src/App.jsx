import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterSeekerPage from './pages/RegisterSeekerPage';
import RegisterEmployerPage from './pages/RegisterEmployerPage';
import SeekerDashboardPage from './pages/SeekerDashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import JobListingPage from './pages/JobListingPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import EditJobPage from './pages/EditJobPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SeekerApplicationsPage from './pages/SeekerApplicationsPage';
import SeekerProfilePage from './pages/SeekerProfilePage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/seeker" element={<RegisterSeekerPage />} />
          <Route path="/register/employer" element={<RegisterEmployerPage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />

          {/* Seeker Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="seeker" />}>
            <Route path="/seeker/dashboard" element={<SeekerDashboardPage />} />
            <Route path="/seeker/profile" element={<SeekerProfilePage />} />
            <Route path="/seeker/applications" element={<SeekerApplicationsPage />} />
          </Route>

          {/* Employer Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
            <Route path="/employer/profile" element={<CompanyProfilePage />} />
            <Route path="/employer/jobs/new" element={<PostJobPage />} />
            <Route path="/employer/jobs/:jobId/edit" element={<EditJobPage />} />
            <Route path="/employer/jobs/:jobId/applications" element={<ApplicationsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
