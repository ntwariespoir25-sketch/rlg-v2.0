import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      loadAdmin();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadAdmin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAdmin(data.data);
      } else {
        localStorage.removeItem('adminToken');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to load admin:', error);
      localStorage.removeItem('adminToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const { token, admin: adminData } = data.data;
        localStorage.setItem('adminToken', token);
        setToken(token);
        setAdmin(adminData);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};