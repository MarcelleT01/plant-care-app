import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Auth from './Auth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return children;
};

export default ProtectedRoute;


