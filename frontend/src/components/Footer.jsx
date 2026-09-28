import { Link } from "react-router-dom";
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        /* ---------- Footer (matches HTML) ---------- */
        .footer {
          background: #0F212D;
          color: rgba(255, 255, 255, 0.7);
          padding: 72px 0 32px;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
        }

        .footer * { box-sizing: border-box; }

        .footer .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 32px;
        }

        /* ---------- Brand ---------- */
        .footer-brand .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Source Serif 4', serif;
          font-size: 19px;
          font-weight: 600;
          color: #FFFFFF;
          text-decoration: none;
          margin-bottom: 18px;
        }

        .footer-brand .nav-logo .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #8FC1A3;
          background: rgba(63, 140, 99, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .footer-brand .nav-logo .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .footer-brand p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.6);
          max-width: 320px;
          margin-bottom: 22px;
        }

        /* ---------- Social ---------- */
        .footer-social {
          display: flex;
          gap: 10px;
        }

        .footer-social a {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, border-color 0.2s ease;
          color: inherit;
        }

        .footer-social a:hover {
          background: #2F6B4F;
          border-color: #2F6B4F;
        }

        .footer-social svg {
          width: 16px;
          height: 16px;
          fill: rgba(255, 255, 255, 0.85);
        }

        /* ---------- Columns ---------- */
        .footer-col h4 {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
        }

        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0;
          margin: 0;
        }

        .footer-col a {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.65);
          transition: color 0.2s ease;
          text-decoration: none;
        }

        .footer-col a:hover {
          color: #F2C94C;
        }

        /* ---------- Bottom ---------- */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-bottom a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-bottom a:hover {
          color: #FFFFFF;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px) {
          .footer .container { padding: 0 32px; }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .footer .container { padding: 0 22px; }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer * { transition: none !important; }
        }
      `}</style>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            {/* ---------- Brand Column ---------- */}
            <div className="footer-brand">
              <Link to="/" className="nav-logo">
                <span className="logo-icon">
                  <img src={logo} alt="Raising Leaders Of Generation logo" />
                </span>
                Raising Leaders Of Generation
              </Link>
              <p>
                A global community of volunteers and changemakers working toward a
                more just, equitable, and compassionate world.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Twitter">
                  <svg viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path
                      d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ---------- Organization Column ---------- */}
            <div className="footer-col">
              <h4>Organization</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/about">Our Team</Link></li>
                <li><Link to="/about">Careers</Link></li>
                <li><Link to="/about">Annual Report</Link></li>
              </ul>
            </div>

            {/* ---------- Programs Column ---------- */}
            <div className="footer-col">
              <h4>Programs</h4>
              <ul>
                <li><Link to="/programs">School Leadership Development</Link></li>
                <li><Link to="/programs">Tournaments & Competitions</Link></li>
                <li><Link to="/programs">Leadership Forums & Conferences</Link></li>
                <li><Link to="/programs">RLG Green Life</Link></li>
              </ul>
            </div>

            {/* ---------- Get Involved Column ---------- */}
            <div className="footer-col">
              <h4>Get Involved</h4>
              <ul>
                <li><Link to="/getinvolved">Volunteer</Link></li>
                <li><Link to="/donate">Donate</Link></li>
                <li><Link to="/contact">Partner With Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

          </div>

          {/* ---------- Bottom Bar ---------- */}
          <div className="footer-bottom">
            <span>
              Powered By <a href="http://wa.me/250799408845">CYBER CODING ARENA</a>
              &nbsp;&copy; {currentYear} . All rights reserved.
            </span>
            <span>
              <a href="#">Privacy Policy</a> &nbsp;&middot;&nbsp;
              <a href="#">Terms of Service</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;