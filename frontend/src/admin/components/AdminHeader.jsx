import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faBell, faChevronDown, faSignOutAlt, faUserCog, faSearch,
} from '@fortawesome/free-solid-svg-icons';

const SEED_NOTIFICATIONS = [
  { id: 1, message: 'New contact message received', read: false, time: '2 min ago' },
  { id: 2, message: 'New donation received', read: false, time: '1 hour ago' },
  { id: 3, message: 'Blog post published', read: true, time: '3 hours ago' },
  { id: 4, message: 'New get involved application', read: false, time: '5 hours ago' },
];

const roleLabel = (role) =>
  typeof role === 'string' ? role.replace(/_/g, ' ') : 'admin';

const AdminHeader = ({ admin, onMenuClick, onLogout }) => {
  const [openMenu, setOpenMenu] = useState(null); // 'notifications' | 'user' | null
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const headerRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close any open dropdown on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  const toggle = (menu) => setOpenMenu((current) => (current === menu ? null : menu));

  const markAsRead = (id) => {
    setNotifications((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
  };

  const initials = (admin?.name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return (
    <header className="admin-header" ref={headerRef}>
      <button
        className="admin-header-toggle"
        onClick={onMenuClick}
        aria-label="Open navigation"
        type="button"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Search — left */}
      <div className="admin-header-search">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="search"
          placeholder="Search the admin panel…"
          aria-label="Search"
        />
      </div>

      {/* Actions — right */}
      <div className="admin-header-actions">
        <div className="admin-dropdown">
          <button
            className={`admin-header-icon-btn${openMenu === 'notifications' ? ' open' : ''}`}
            onClick={() => toggle('notifications')}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={openMenu === 'notifications'}
            type="button"
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span className="admin-header-badge">{unreadCount}</span>}
          </button>

          {openMenu === 'notifications' && (
            <div className="admin-dropdown-menu notifications" role="menu">
              <div className="admin-dropdown-head">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="admin-dropdown-link"
                    style={{ width: 'auto', padding: 0, color: 'var(--admin-primary)' }}
                    type="button"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.map((item) => (
                <button
                  key={item.id}
                  className={`admin-notification-item${item.read ? '' : ' unread'}`}
                  onClick={() => markAsRead(item.id)}
                  type="button"
                >
                  <div>
                    <p>{item.message}</p>
                    <small>{item.time}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="admin-dropdown">
          <button
            className={`admin-user-btn${openMenu === 'user' ? ' open' : ''}`}
            onClick={() => toggle('user')}
            aria-expanded={openMenu === 'user'}
            type="button"
          >
            <span className="admin-user-avatar">{initials}</span>
            <span className="admin-user-meta">
              <span className="admin-user-name">{admin?.name || 'Admin'}</span>
              <span className="admin-user-role">{roleLabel(admin?.role)}</span>
            </span>
            <FontAwesomeIcon icon={faChevronDown} className="admin-user-chevron" />
          </button>

          {openMenu === 'user' && (
            <div className="admin-dropdown-menu" role="menu">
              <button
                className="admin-dropdown-link"
                onClick={() => {
                  setOpenMenu(null);
                  window.location.href = '/admin/settings';
                }}
                type="button"
              >
                <FontAwesomeIcon icon={faUserCog} /> Profile settings
              </button>
              <button
                className="admin-dropdown-link danger"
                onClick={() => {
                  setOpenMenu(null);
                  onLogout();
                }}
                type="button"
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
