import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUserCircle, faChevronDown, faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';

const AdminHeader = ({ admin, onMenuClick, onLogout, isMobile }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New contact message received', read: false, time: '2 min ago' },
    { id: 2, message: 'New donation of $50', read: false, time: '1 hour ago' },
    { id: 3, message: 'Blog post published', read: true, time: '3 hours ago' },
    { id: 4, message: 'New get involved application', read: false, time: '5 hours ago' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="admin-header">
      <button className="menu-toggle" onClick={onMenuClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      
      <div className="header-search">
        <input type="text" placeholder="Search..." />
      </div>
      
      <div className="header-actions">
        <div className="notification-dropdown">
          <button className="notification-btn">
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <div className="notification-menu">
            <div className="notification-header">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read">Mark all as read</button>
              )}
            </div>
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="notification-content">
                  <p>{notif.message}</p>
                  <small>{notif.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="user-menu">
          <button className="user-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <FontAwesomeIcon icon={faUserCircle} />
            <span>{admin?.name?.split(' ')[0] || 'Admin'}</span>
            <FontAwesomeIcon icon={faChevronDown} className="chevron" />
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => window.location.href = '/admin/settings'}>
                <FontAwesomeIcon icon={faUserCog} /> Profile Settings
              </button>
              <button onClick={onLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-header {
          background: white;
          padding: 15px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 99;
        }
        
        .menu-toggle {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #374151;
          display: none;
        }
        
        .header-search input {
          padding: 8px 15px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          width: 250px;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .header-search input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .notification-dropdown {
          position: relative;
        }
        
        .notification-btn {
          position: relative;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
        }
        
        .notification-btn:hover {
          color: #22c55e;
        }
        
        .notification-btn .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 10px;
        }
        
        .notification-menu {
          position: absolute;
          top: 100%;
          right: 0;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          z-index: 100;
          display: none;
          animation: fadeIn 0.2s ease;
        }
        
        .notification-dropdown:hover .notification-menu {
          display: block;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
        }
        
        .mark-all-read {
          background: none;
          border: none;
          color: #22c55e;
          font-size: 12px;
          cursor: pointer;
        }
        
        .notification-item {
          padding: 12px 15px;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .notification-item.unread {
          background: #f0fdf4;
        }
        
        .notification-item:hover {
          background: #f3f4f6;
        }
        
        .notification-content p {
          font-size: 13px;
          color: #374151;
          margin-bottom: 4px;
        }
        
        .notification-content small {
          font-size: 11px;
          color: #9ca3af;
        }
        
        .user-menu {
          position: relative;
        }
        
        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        
        .user-btn:hover {
          background: #f3f4f6;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          min-width: 200px;
          z-index: 100;
          margin-top: 8px;
          overflow: hidden;
        }
        
        .dropdown-menu button {
          width: 100%;
          padding: 12px 15px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.3s ease;
        }
        
        .dropdown-menu button:hover {
          background: #f3f4f6;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
          
          .header-search {
            display: none;
          }
          
          .user-btn span {
            display: none;
          }
          
          .admin-header {
            padding: 12px 15px;
          }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;