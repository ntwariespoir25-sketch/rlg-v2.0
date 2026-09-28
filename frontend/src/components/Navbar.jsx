import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHeart, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import aboutImage from '../assets/about-image.jpg';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 4 links — matches the image (About, Programs, Impact, Stories) + a couple extra for full site
  const navLinks = [
    { to: "/about", label: "About" },
    { to: "/programs", label: "Programs" },
    { to: "/blog", label: "Stories" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
    { to: "/donate", label: "Donate" },
  ];

  return (
    <>
      <style>{`
        /* ============================================================
           NAVBAR — matches reference image
           - Transparent over hero
           - Serif wordmark logo
           - Gold rectangular CTA
           ============================================================ */
        .pf-nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          transition: background .3s ease, box-shadow .3s ease, padding .3s ease;
        }

        .pf-nav.is-scrolled {
          position: fixed;
          background: rgba(15, 33, 45, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
        }

        .pf-nav__inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 26px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          transition: padding .3s ease;
        }

        .pf-nav.is-scrolled .pf-nav__inner {
          padding: 16px 48px;
        }

        /* ---------- Logo (single line, serif) ---------- */
        .pf-nav__logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Source Serif 4', 'Source Serif Pro', Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: #FFFFFF;
          letter-spacing: -0.01em;
          text-decoration: none;
          flex-shrink: 0;
        }

        .pf-nav__logo:hover {
          color: #FFFFFF;
        }

        .pf-nav__logo .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #8FC1A3;
          background: rgba(63, 140, 99, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          transition: transform .25s ease, border-color .25s ease;
        }

        .pf-nav__logo:hover .logo-icon {
          transform: scale(1.05);
          border-color: #8FC1A3;
        }

        .pf-nav__logo .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        /* ---------- Links ---------- */
        .pf-nav__links {
          display: flex;
          align-items: center;
          gap: 42px;
          margin-left: auto;
          margin-right: 42px;
        }

        .pf-nav__link {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.88);
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color .2s ease;
          position: relative;
        }

        .pf-nav__link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 2px;
          background: #F2C94C;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s ease;
        }

        .pf-nav__link:hover {
          color: #F2C94C;
        }

        .pf-nav__link:hover::after,
        .pf-nav__link.active::after {
          transform: scaleX(1);
        }

        .pf-nav__link.active {
          color: #F2C94C;
        }

        /* ---------- Scrolled variants ---------- */
        .pf-nav.is-scrolled .pf-nav__logo {
          color: #FFFFFF;
        }

        .pf-nav.is-scrolled .pf-nav__link {
          color: rgba(255, 255, 255, 0.88);
        }

        .pf-nav.is-scrolled .pf-nav__link:hover,
        .pf-nav.is-scrolled .pf-nav__link.active {
          color: #F2C94C;
        }

        /* ---------- Get Involved CTA (gold rectangle) ---------- */
        .pf-nav__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F2C94C;
          color: #0F212D;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 28px;
          border-radius: 6px;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(242, 201, 76, 0.25);
          transition: background .2s ease, transform .15s ease, box-shadow .2s ease;
        }

        .pf-nav__cta:hover {
          background: #E0B63A;
          color: #0F212D;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(242, 201, 76, 0.4);
        }

        /* ---------- Mobile Toggle ---------- */
        .pf-nav__toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.35rem;
          color: #FFFFFF;
          cursor: pointer;
          padding: .5rem;
          margin-left: auto;
        }

        /* ---------- Drawer Overlay ---------- */
        .pf-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 33, 45, .55);
          z-index: 1001;
          opacity: 0;
          visibility: hidden;
          transition: opacity .3s ease;
        }

        .pf-drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        /* ---------- Drawer ---------- */
        .pf-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 86%;
          max-width: 360px;
          background: #FAF8F4;
          z-index: 1002;
          transform: translateX(100%);
          transition: transform .3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 30px rgba(15, 33, 45, .18);
        }

        .pf-drawer.open {
          transform: translateX(0);
        }

        .pf-drawer__head {
          display: flex;
          align-items: center;
          gap: .6rem;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid #E4DFD3;
          background: #FFFFFF;
        }

        .pf-drawer__head .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #2F6B4F;
          background: rgba(47, 107, 79, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .pf-drawer__head .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .pf-drawer__head b {
          color: #152B3A;
          font-size: 1rem;
          font-family: 'Source Serif 4', Georgia, serif;
          font-weight: 600;
        }

        .pf-drawer__close {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #6B7178;
          cursor: pointer;
          padding: .4rem;
        }

        .pf-drawer__nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: .2rem;
          overflow-y: auto;
        }

        .pf-drawer__link {
          padding: .85rem 1rem;
          border-radius: .5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #3A3F42;
          text-decoration: none;
          transition: background .2s ease, color .2s ease;
        }

        .pf-drawer__link:hover {
          background: rgba(47, 107, 79, .08);
          color: #2F6B4F;
        }

        .pf-drawer__link.active {
          background: #2F6B4F;
          color: #FFFFFF;
        }

        .pf-drawer__foot {
          padding: 1.25rem;
          border-top: 1px solid #E4DFD3;
          background: #FFFFFF;
          display: grid;
          gap: .85rem;
        }

        .pf-drawer__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          background: #F2C94C;
          color: #0F212D;
          padding: .9rem;
          border-radius: 6px;
          font-weight: 700;
          text-decoration: none;
          transition: background .2s ease;
        }

        .pf-drawer__cta:hover {
          background: #E0B63A;
        }

        .pf-drawer__contact {
          font-size: .74rem;
          color: #6B7178;
          text-align: center;
          line-height: 1.9;
        }

        .pf-drawer__contact p {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .4rem;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1100px) {
          .pf-nav__links {
            display: none;
          }
          .pf-nav__cta {
            display: none;
          }
          .pf-nav__toggle {
            display: inline-flex;
          }
          .pf-nav__inner {
            padding: 20px 32px;
          }
          .pf-nav.is-scrolled .pf-nav__inner {
            padding: 14px 32px;
          }
        }

        @media (max-width: 640px) {
          .pf-nav__inner {
            padding: 18px 22px;
          }
          .pf-nav.is-scrolled .pf-nav__inner {
            padding: 12px 22px;
          }
          .pf-nav__logo {
            font-size: 19px;
          }
          .pf-nav__logo .logo-icon {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>

      {/* ---------- NAVBAR ---------- */}
      <nav className={`pf-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="pf-nav__inner">
          {/* Logo — single line, serif */}
          <Link to="/" className="pf-nav__logo" onClick={() => setIsOpen(false)}>
            <span className="logo-icon">
              <img src={logo} alt="Rising Leaders Of Generation logo" />
            </span>
            Rising Leaders Of Generation
          </Link>

          {/* Center/right links */}
          <div className="pf-nav__links">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `pf-nav__link ${isActive ? "active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Gold CTA */}
          <Link to="/getinvolved" className="pf-nav__cta">
            Get Involved
          </Link>

          {/* Mobile toggle */}
          <button
            className="pf-nav__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
      </nav>

      {/* ---------- DRAWER ---------- */}
      <div
        className={`pf-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`pf-drawer ${isOpen ? "open" : ""}`}>
        <div className="pf-drawer__head">
          <span className="logo-icon">
            <img src={logo} alt="Rising Leaders Of Generation logo" />
          </span>
          <b>Rising Leaders Of Generation</b>
          <button
            className="pf-drawer__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="pf-drawer__nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `pf-drawer__link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="pf-drawer__foot">
          <Link
            to="/getinvolved"
            className="pf-drawer__cta"
            onClick={() => setIsOpen(false)}
          >
            Get Involved
          </Link>
          <div className="pf-drawer__contact">
            <p>
              <FontAwesomeIcon icon={faEnvelope} />{" "}
              raisingleaderofgeneration@gmail.com
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} /> +250 784 769 382 | +250 792 588 272
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;