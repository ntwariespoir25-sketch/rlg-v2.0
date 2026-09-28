import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faSave, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Settings = () => {
  const { admin, logout } = useAdmin();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      Swal.fire('Error', 'Password must be at least 6 characters', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Your password has been changed successfully. Please login again.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          logout();
          window.location.href = '/admin/login';
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile and account settings</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h2><FontAwesomeIcon icon={faUser} /> Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label><FontAwesomeIcon icon={faUser} /> Full Name</label>
              <input 
                type="text" 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label><FontAwesomeIcon icon={faEnvelope} /> Email Address</label>
              <input 
                type="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label><FontAwesomeIcon icon={faPhone} /> Phone Number</label>
              <input 
                type="tel" 
                value={profileData.phone} 
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="+250XXXXXXXXX"
              />
            </div>
            <button type="submit" className="btn-save" disabled={loading}>
              <FontAwesomeIcon icon={faSave} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h2><FontAwesomeIcon icon={faLock} /> Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-save" disabled={loading}>
              <FontAwesomeIcon icon={faLock} /> {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .settings-page { padding: 20px; }
        .settings-header { margin-bottom: 30px; }
        .settings-header h1 { font-size: 24px; color: #1f2937; margin-bottom: 5px; }
        .settings-header p { color: #6b7280; }
        .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
        .settings-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .settings-card h2 { font-size: 18px; color: #374151; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #4b5563; }
        .form-group input { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; transition: all 0.3s ease; }
        .form-group input:focus { outline: none; border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
        .password-input { position: relative; }
        .password-input input { padding-right: 45px; }
        .password-input button { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; }
        .btn-save { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
        .btn-save:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Settings;