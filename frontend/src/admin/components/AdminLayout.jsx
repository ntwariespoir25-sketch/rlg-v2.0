import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdmin } from '../contexts/AdminContext';
import Swal from 'sweetalert2';
import '../styles/adminTheme.css';

const MOBILE_BREAKPOINT = 1024;

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );
  const { admin, logout, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Log out?',
      text: 'You will be returned to the admin login page.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#0f5132',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      logout();
      Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have been successfully logged out.',
        timer: 1400,
        showConfirmButton: false,
      });
      navigate('/admin/login', { replace: true });
    }
  };

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((open) => !open);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((value) => !value);
  }, []);

  if (!admin) return null;

  return (
    <div
      className={`admin-shell${collapsed && !isMobile ? ' sidebar-collapsed' : ''}`}
    >
      <AdminSidebar
        isOpen={drawerOpen}
        isMobile={isMobile}
        isCollapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        onMobileClose={closeDrawer}
      />

      <div className="admin-main">
        <AdminHeader
          admin={admin}
          onMenuClick={toggleDrawer}
          onLogout={handleLogout}
          isMobile={isMobile}
        />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
