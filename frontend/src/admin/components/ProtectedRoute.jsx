import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();
  const token = localStorage.getItem('adminToken');

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '20px',
        background: 'linear-gradient(135deg, #0a2a1a 0%, #14532d 100%)',
        color: 'white'
      }}>
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading admin panel...</p>
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