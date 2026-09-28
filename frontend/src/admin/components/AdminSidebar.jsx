import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard, faBlog, faCalendar, faImage, faEnvelope,
  faHandHoldingHeart, faComments, faCog, faSignOutAlt,
  faGraduationCap, faHandsHelping, faTimes, faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import { logo } from '../../assets';
import { useAdmin } from '../contexts/AdminContext';
import Swal from 'sweetalert2';

const MENU_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/admin/dashboard', icon: faDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/blogs', icon: faBlog, label: 'Blogs' },
      { to: '/admin/programs', icon: faGraduationCap, label: 'Programs' },
      { to: '/admin/events', icon: faCalendar, label: 'Events' },
      { to: '/admin/gallery', icon: faImage, label: 'Gallery' },
      { to: '/admin/testimonials', icon: faComments, label: 'Testimonials' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/admin/contacts', icon: faEnvelope, label: 'Contacts' },
      { to: '/admin/donations', icon: faHandHoldingHeart, label: 'Donations' },
      { to: '/admin/getinvolved', icon: faHandsHelping, label: 'Get Involved' },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/admin/settings', icon: faCog, label: 'Settings' }],
  },
];

const AdminSidebar = ({ isOpen, isMobile, isCollapsed, onToggleCollapse, onMobileClose }) => {
  const { logout } = useAdmin();
  const location = useLocation();

  // Auto-close the drawer whenever the route changes.
  useEffect(() => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, onMobileClose]);

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
      window.location.href = '/admin/login';
    }
  };

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`admin-sidebar${isOpen ? ' open' : ''}`}
      >
        <div className="admin-sidebar-brand">
          <img src={logo} alt="RLG" className="admin-sidebar-logo" />
          <span className="admin-sidebar-title">RLG Admin</span>

          {isMobile ? (
            <button
              className="admin-sidebar-close"
              onClick={onMobileClose}
              aria-label="Close navigation"
              type="button"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <button
              className="admin-collapse-btn"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              type="button"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {MENU_GROUPS.map((group) => (
            <React.Fragment key={group.label}>
              <div className="admin-nav-section">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `admin-sidebar-link${isActive ? ' active' : ''}`
                  }
                  title={item.label}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-sidebar-link admin-logout-btn"
            onClick={handleLogout}
            type="button"
            title="Log out"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
