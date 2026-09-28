import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { logo } from '../../assets';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both email and password.',
        confirmButtonColor: '#2F6B4F',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data.admin));

        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${data.data.admin.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        window.location.href = '/admin/dashboard';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid email or password',
          confirmButtonColor: '#2F6B4F',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Unable to connect to the server. Please check if the backend is running.',
        confirmButtonColor: '#2F6B4F',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Decorative background layers matching home hero */}
      <div className="admin-login-bg-overlay" />
      <div className="admin-login-glow admin-login-glow-1" />
      <div className="admin-login-glow admin-login-glow-2" />

      <div className="admin-login-container">
        {/* LEFT PANEL — brand / info, hidden on mobile */}
        <aside className="admin-login-aside">
          <div className="admin-login-aside-inner">
            <span className="admin-login-eyebrow">
              <span className="dot" />
              Admin Portal
            </span>
            <h1>
              Welcome back to <br />
              <span className="accent">RLG</span> Leadership
            </h1>
            <p className="admin-login-aside-lead">
              Manage programs, volunteers, stories, and impact — all from one
              secure dashboard.
            </p>

            <ul className="admin-login-aside-features">
              <li>
                <span className="check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Manage programs & events
              </li>
              <li>
                <span className="check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Review testimonials & stories
              </li>
              <li>
                <span className="check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                Track impact & analytics
              </li>
            </ul>

            <div className="admin-login-aside-footer">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>End-to-end encrypted access</span>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL — the login card */}
        <main className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-logo-wrap">
              <img src={logo} alt="RLG Logo" className="admin-login-logo" />
            </div>
            <h2>Admin Sign In</h2>
            <p>Raising Leaders of Generation</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-email">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rlg.org"
                required
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Logging in…
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} /> Login to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="admin-login-card-footer">
            <FontAwesomeIcon icon={faShieldAlt} />
            <span>Secure Admin Access Only</span>
          </div>
        </main>
      </div>

      <style>{`
        /* ============================================================
           ADMIN LOGIN — matches RLG public site design language
           ============================================================ */
        .admin-login-page {
          --admin-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --navy: #152B3A;
          --navy-deep: #0F212D;
          --green: #2F6B4F;
          --green-deep: #234F3B;
          --green-light: #8FC1A3;
          --green-bright: #3F8C63;
          --gold: #F2C94C;
          --gold-hover: #E0B63A;
          --paper: #FAF8F4;
          --paper-dim: #F1EDE3;
          --line: #E4DFD3;
          --text: #3A3F42;
          --text-soft: #6B7178;

          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background:
            radial-gradient(ellipse at top left, rgba(143, 193, 163, 0.18), transparent 55%),
            radial-gradient(ellipse at bottom right, rgba(242, 201, 76, 0.12), transparent 55%),
            linear-gradient(135deg, var(--navy-deep) 0%, var(--green-deep) 100%);
          position: relative;
          overflow: hidden;
          font-family: var(--admin-font);
          color: var(--text);
        }

        /* Layered decorative glows */
        .admin-login-bg-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          pointer-events: none;
        }
        .admin-login-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .admin-login-glow-1 {
          width: 420px; height: 420px;
          background: rgba(63, 140, 99, 0.35);
          top: -120px; left: -80px;
        }
        .admin-login-glow-2 {
          width: 360px; height: 360px;
          background: rgba(242, 201, 76, 0.18);
          bottom: -100px; right: -80px;
        }

        .admin-login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 980px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(18px);
        }

        /* ---------- Left aside ---------- */
        .admin-login-aside {
          background: linear-gradient(160deg, rgba(47, 107, 79, 0.9) 0%, rgba(15, 33, 45, 0.95) 100%);
          padding: 56px 48px;
          display: flex;
          align-items: center;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .admin-login-aside::before {
          content: '';
          position: absolute;
          top: -40%; right: -30%;
          width: 80%; height: 120%;
          background: radial-gradient(ellipse, rgba(242, 201, 76, 0.15), transparent 65%);
          pointer-events: none;
        }
        .admin-login-aside-inner {
          position: relative;
          z-index: 1;
        }
        .admin-login-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--green-light);
          margin-bottom: 20px;
        }
        .admin-login-eyebrow .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
        }
        .admin-login-aside h1 {
          font-family: var(--admin-font);
          font-weight: 700;
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 18px;
        }
        .admin-login-aside h1 .accent { color: var(--gold); }
        .admin-login-aside-lead {
          font-size: 15.5px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 32px;
          max-width: 360px;
        }
        .admin-login-aside-features {
          list-style: none;
          padding: 0;
          margin: 0 0 36px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .admin-login-aside-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.88);
        }
        .admin-login-aside-features .check {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(242, 201, 76, 0.18);
          border: 1px solid rgba(242, 201, 76, 0.4);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .admin-login-aside-features .check svg {
          width: 12px; height: 12px;
          color: var(--gold);
        }
        .admin-login-aside-footer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.65);
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* ---------- Right card ---------- */
        .admin-login-card {
          background: rgba(255, 255, 255, 0.98);
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .admin-login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .admin-login-logo-wrap {
          width: 72px; height: 72px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(47, 107, 79, 0.12), rgba(63, 140, 99, 0.08));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border: 1px solid rgba(47, 107, 79, 0.15);
        }
        .admin-login-logo {
          width: 48px; height: 48px;
          object-fit: contain;
        }
        .admin-login-header h2 {
          font-family: var(--admin-font);
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -0.01em;
          color: var(--navy);
          margin-bottom: 6px;
        }
        .admin-login-header p {
          font-size: 13.5px;
          color: var(--text-soft);
          letter-spacing: 0.02em;
        }

        .admin-login-form .form-group {
          margin-bottom: 20px;
        }
        .admin-login-form label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 8px;
          font-size: 13.5px;
          letter-spacing: 0.01em;
        }
        .admin-login-form label .input-icon {
          color: var(--green);
          font-size: 13px;
        }
        .admin-login-form input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid var(--line);
          border-radius: 10px;
          font-size: 14.5px;
          font-family: var(--admin-font);
          background: var(--paper);
          color: var(--navy);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .admin-login-form input::placeholder {
          color: #9AA0A6;
        }
        .admin-login-form input:focus {
          outline: none;
          background: #fff;
          border-color: var(--green);
          box-shadow: 0 0 0 4px rgba(47, 107, 79, 0.12);
        }
        .password-input-wrapper { position: relative; }
        .password-input-wrapper input { padding-right: 48px; }
        .toggle-password {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-soft);
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .toggle-password:hover {
          color: var(--green);
          background: rgba(47, 107, 79, 0.08);
        }

        .admin-login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--green-bright) 0%, var(--green) 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15.5px;
          font-weight: 700;
          font-family: var(--admin-font);
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 22px rgba(47, 107, 79, 0.28);
          margin-top: 8px;
        }
        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(47, 107, 79, 0.38);
          filter: brightness(1.03);
        }
        .admin-login-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .admin-login-card-footer {
          text-align: center;
          margin-top: 26px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          color: var(--text-soft);
          font-size: 12.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .admin-login-card-footer svg { color: var(--green); }

        /* ---------- Responsive ---------- */
        @media (max-width: 860px) {
          .admin-login-container {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .admin-login-aside {
            display: none;
          }
          .admin-login-card {
            padding: 44px 32px;
          }
        }
        @media (max-width: 480px) {
          .admin-login-page { padding: 24px 16px; }
          .admin-login-card { padding: 36px 24px; }
          .admin-login-header h2 { font-size: 22px; }
          .admin-login-logo-wrap { width: 64px; height: 64px; }
          .admin-login-logo { width: 42px; height: 42px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-login-page * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;