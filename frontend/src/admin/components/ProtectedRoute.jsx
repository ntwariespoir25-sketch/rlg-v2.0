import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/adminTheme.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();
  const token = localStorage.getItem('adminToken');

  if (loading) {
    return (
      <div className="admin-boot">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading admin panel…</p>
      </div>
    );
  }

  // Check both context and localStorage
  if (!isAuthenticated && !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;