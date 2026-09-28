import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard, faBlog, faCalendar, faImage, faEnvelope,
  faHeart, faComments, faCog, faSignOutAlt,
  faGraduationCap, faHandHoldingHeart, faBars, faTimes,
  faChevronLeft, faChevronRight, faHandsHelping, faUsers,
  faBuilding, faStar
} from '@fortawesome/free-solid-svg-icons';
import { logo } from '../../assets';
import { useAdmin } from '../contexts/AdminContext';
import Swal from 'sweetalert2';

const AdminSidebar = ({ isOpen, onToggle, isMobile, onMobileClose }) => {
  const { logout } = useAdmin();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const menuItems = [
    { path: '/admin/dashboard', icon: faDashboard, label: 'Dashboard' },
    { path: '/admin/blogs', icon: faBlog, label: 'Blogs' },
    { path: '/admin/programs', icon: faGraduationCap, label: 'Programs' },
    { path: '/admin/events', icon: faCalendar, label: 'Events' },
    { path: '/admin/gallery', icon: faImage, label: 'Gallery' },
    { path: '/admin/contacts', icon: faEnvelope, label: 'Contacts' },
    { path: '/admin/donations', icon: faHandHoldingHeart, label: 'Donations' },
    { path: '/admin/testimonials', icon: faComments, label: 'Testimonials' },
    { path: '/admin/getinvolved', icon: faHandsHelping, label: 'Get Involved' },
    { path: '/admin/settings', icon: faCog, label: 'Settings' },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      logout();
      window.location.href = '/admin/login';
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (onToggle && !isMobile) {
      onToggle(!collapsed);
    }
  };

  // Desktop sidebar with collapse
  if (!isMobile) {
    return (
      <>
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <img src={logo} alt="RLG" className="sidebar-logo" />
              {!collapsed && <span className="sidebar-brand-text">RLG Admin</span>}
            </div>
            <button className="collapse-btn" onClick={toggleCollapse}>
              <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
            </button>
          </div>
          
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <button className="sidebar-link logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Mobile sidebar (drawer with words visible)
  return (
    <>
      <div className={`mobile-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onMobileClose} />
      <aside className={`mobile-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="mobile-sidebar-header">
          <img src={logo} alt="RLG" className="sidebar-logo" />
          <span className="sidebar-brand-text">RLG Admin</span>
          <button className="mobile-close-btn" onClick={onMobileClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onMobileClose}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        /* Mobile Sidebar */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .mobile-sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #0a2a1a 0%, #06122a 100%);
          color: white;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1001;
          display: flex;
          flex-direction: column;
        }
        
        .mobile-sidebar.active {
          transform: translateX(0);
        }
        
        .mobile-sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: relative;
        }
        
        .mobile-sidebar-header .sidebar-logo {
          width: 40px;
          height: 40px;
        }
        
        .mobile-sidebar-header .sidebar-brand-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .mobile-close-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        
        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #d1d5db;
          text-decoration: none;
          transition: all 0.3s ease;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        
        .sidebar-link:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        
        .sidebar-link.active {
          background: linear-gradient(90deg, #22c55e, #16a34a);
          color: white;
        }
        
        .sidebar-footer {
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        /* Desktop Sidebar */
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, #0a2a1a 0%, #06122a 100%);
          color: white;
          transition: width 0.3s ease;
          z-index: 100;
          overflow-y: auto;
        }
        
        .admin-sidebar.collapsed {
          width: 70px;
        }
        
        .admin-sidebar.collapsed .sidebar-brand-text,
        .admin-sidebar.collapsed .sidebar-link span {
          display: none;
        }
        
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .sidebar-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
        
        .sidebar-brand-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .collapse-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .collapse-btn:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;