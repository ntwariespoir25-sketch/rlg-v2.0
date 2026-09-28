import { Link } from "react-router-dom";

// --- IMPORT LOCAL ASSETS ---
import aboutImage from '../assets/about-image.jpg';
import dotsPattern from '../assets/dots-pattern.png';
import event1 from '../assets/event-1.jpg';
import event2 from '../assets/event-2.jpg';
import event3 from '../assets/event-3.jpg';
import footerLogo from '../assets/footer-logo.png';
import heroBg from '../assets/hero-bg.jpg';
import heroImage from '../assets/hero-image.png';
import heroImg from '../assets/hero-img.jpg';
import hero from '../assets/hero.png';
import logo from '../assets/logo.png';
import patternBg from '../assets/pattern-bg.svg';
import programIcon1 from '../assets/program-icon-1.png';
import programIcon2 from '../assets/program-icon-2.png';
import programIcon3 from '../assets/program-icon-3.png';
import reactSvg from '../assets/react.svg';
import founder from '../assets/founder.png';

export default function About() {
  return (
    <>
      <style>{`
        /* ============================================================
           ABOUT PAGE — matches HTML exactly
           ============================================================ */
        :root{
          --navy:#152B3A;
          --navy-deep:#0F212D;
          --green:#2F6B4F;
          --green-deep:#234F3B;
          --green-light:#8FC1A3;
          --green-bright:#3F8C63;
          --gold:#F2C94C;
          --gold-hover:#E0B63A;
          --paper:#FAF8F4;
          --paper-dim:#F1EDE3;
          --line:#E4DFD3;
          --text:#3A3F42;
          --text-soft:#6B7178;
        }

        .ab-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .ab-page *{ box-sizing:border-box; }
        .ab-page img{ max-width:100%; display:block; }

        .ab-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .ab-section{
          padding:100px 0;
          position:relative;
        }

        /* ---------- Section head ---------- */
        .ab-section-head{
          max-width:640px;
          margin-bottom:56px;
        }
        .ab-section-head.center{
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .ab-section-head h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(32px, 3.5vw, 44px);
          line-height:1.15;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:16px;
        }
        .ab-section-head p{
          font-size:16px;
          color:var(--text-soft);
          line-height:1.7;
        }

        .ab-eyebrow{
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-size:12.5px;
          font-weight:700;
          letter-spacing:0.12em;
          text-transform:uppercase;
          color:var(--green);
          margin-bottom:16px;
        }
        .ab-eyebrow .dot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .ab-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
          text-align:center;
        }
        .ab-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.22), transparent 65%);
          pointer-events:none;
        }
        .ab-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .ab-hero-inner{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .ab-hero .ab-eyebrow{
          color:var(--green-light);
          justify-content:center;
        }
        .ab-hero h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 60px);
          line-height:1.1;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .ab-hero h1 .accent{ color:var(--gold); }
        .ab-hero p{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.82);
          max-width:620px;
          margin:0 auto;
        }

        /* ---------- Story Section ---------- */
        .ab-story-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:72px;
          align-items:center;
        }
        .ab-story-image{
          position:relative;
          height:540px;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 24px 64px rgba(21,43,58,0.18);
          /* Background image added here */
          background-image: url(${aboutImage});
          background-size: cover;
          background-position: center;
        }
        .ab-story-image img{
          width:100%; height:100%;
          object-fit:cover;
        }
        .ab-story-image::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(180deg, rgba(15,33,45,0.05) 0%, rgba(35,79,59,0.35) 100%);
        }
        .ab-story-badge{
          position:absolute;
          bottom:24px; left:24px;
          z-index:2;
          background:rgba(255,255,255,0.95);
          backdrop-filter:blur(10px);
          border-radius:12px;
          padding:16px 22px;
          box-shadow:0 12px 32px rgba(0,0,0,0.18);
        }
        .ab-story-badge .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:28px;
          font-weight:700;
          color:var(--green-deep);
          line-height:1;
          display:block;
          margin-bottom:4px;
        }
        .ab-story-badge .lbl{
          font-size:12px;
          font-weight:600;
          letter-spacing:0.06em;
          text-transform:uppercase;
          color:var(--text-soft);
        }
        .ab-story-content h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 40px);
          line-height:1.18;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:20px;
        }
        .ab-story-content > p{
          font-size:16px;
          color:var(--text-soft);
          line-height:1.75;
          margin-bottom:20px;
        }
        .ab-story-quote{
          border-left:4px solid var(--green);
          background:var(--paper-dim);
          padding:22px 26px;
          border-radius:0 10px 10px 0;
          margin:28px 0 32px;
          position:relative;
        }
        .ab-story-quote .quote-mark{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:44px;
          line-height:0.6;
          color:var(--green-light);
          display:block;
          margin-bottom:8px;
        }
        .ab-story-quote p{
          font-family:'Source Serif 4', Georgia, serif;
          font-style:italic;
          font-size:16.5px;
          line-height:1.6;
          color:var(--navy);
        }
        .ab-story-actions{
          display:flex;
          gap:14px;
          flex-wrap:wrap;
        }

        .ab-btn-primary{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:var(--green);
          color:#fff;
          font-size:15px;
          font-weight:700;
          padding:15px 30px;
          border-radius:6px;
          border:none;
          cursor:pointer;
          text-decoration:none;
          transition:background 0.2s ease, transform 0.15s ease;
          box-shadow:0 6px 18px rgba(47,107,79,0.28);
          font-family:'Inter', sans-serif;
        }
        .ab-btn-primary:hover{
          background:var(--green-bright);
          transform:translateY(-2px);
        }
        .ab-btn-primary svg{ width:16px; height:16px; }

        .ab-btn-outline{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:transparent;
          color:var(--navy);
          font-size:15px;
          font-weight:600;
          padding:15px 30px;
          border-radius:6px;
          border:1.5px solid var(--line);
          cursor:pointer;
          text-decoration:none;
          transition:border-color 0.2s ease, color 0.2s ease;
          font-family:'Inter', sans-serif;
        }
        .ab-btn-outline:hover{
          border-color:var(--green);
          color:var(--green);
        }

        /* ---------- Stats Section ---------- */
        .ab-stats-section{
          background:linear-gradient(180deg, var(--paper) 0%, var(--paper-dim) 100%);
        }
        .ab-stats-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:24px;
        }
        .ab-stat-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          padding:36px 24px;
          text-align:center;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position:relative;
          overflow:hidden;
        }
        .ab-stat-card::before{
          content:'';
          position:absolute;
          top:0; left:50%;
          transform:translateX(-50%);
          width:48px;
          height:3px;
          background:linear-gradient(90deg, var(--green), var(--green-light));
          border-radius:0 0 3px 3px;
        }
        .ab-stat-card:hover{
          transform:translateY(-6px);
          box-shadow:0 20px 48px rgba(21,43,58,0.12);
          border-color:var(--green-light);
        }
        .ab-stat-card .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:44px;
          font-weight:700;
          color:var(--navy);
          line-height:1;
          margin-bottom:10px;
        }
        .ab-stat-card .num .plus{ color:var(--green); }
        .ab-stat-card .lbl{
          font-size:14px;
          color:var(--text-soft);
          line-height:1.5;
        }

        /* ---------- Mission & Vision ---------- */
        .ab-mv-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:28px;
          margin-bottom:28px;
        }
        .ab-mv-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:44px 40px;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          position:relative;
          overflow:hidden;
        }
        .ab-mv-card::before{
          content:'';
          position:absolute;
          top:0; right:0;
          width:180px; height:180px;
          background:radial-gradient(circle, rgba(143,193,163,0.15), transparent 70%);
          pointer-events:none;
        }
        .ab-mv-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 56px rgba(21,43,58,0.12);
        }
        .ab-mv-icon{
          width:60px; height:60px;
          border-radius:14px;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:22px;
          box-shadow:0 8px 22px rgba(47,107,79,0.3);
          position:relative;
          z-index:1;
        }
        .ab-mv-icon svg{
          width:28px; height:28px;
          stroke:#fff; fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .ab-mv-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:24px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:14px;
          position:relative;
          z-index:1;
        }
        .ab-mv-card p{
          font-size:15.5px;
          color:var(--text-soft);
          line-height:1.75;
          position:relative;
          z-index:1;
        }

        /* ---------- Values Grid ---------- */
        .ab-values-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:24px;
        }
        .ab-value-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          padding:36px 26px;
          text-align:center;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ab-value-card:hover{
          transform:translateY(-6px);
          box-shadow:0 20px 44px rgba(21,43,58,0.1);
          border-color:var(--green-light);
        }
        .ab-value-icon{
          width:52px; height:52px;
          border-radius:50%;
          background:linear-gradient(135deg, rgba(47,107,79,0.14), rgba(63,140,99,0.06));
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 18px;
        }
        .ab-value-icon svg{
          width:24px; height:24px;
          stroke:var(--green); fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .ab-value-card h4{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:17px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:8px;
        }
        .ab-value-card p{
          font-size:13.5px;
          color:var(--text-soft);
          line-height:1.6;
        }

        /* ---------- Founders Section ---------- */
        .ab-founders-section{
          background:linear-gradient(180deg, var(--paper-dim) 0%, var(--paper) 100%);
        }
        .ab-founders-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:28px;
          max-width:900px;
          margin:0 auto;
        }
        .ab-founder-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:44px 36px;
          text-align:center;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          position:relative;
          overflow:hidden;
        }
        .ab-founder-card::before{
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:120px;
          background:linear-gradient(135deg, rgba(47,107,79,0.08), rgba(143,193,163,0.12));
          pointer-events:none;
        }
        .ab-founder-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 56px rgba(21,43,58,0.14);
        }
       .ab-founder-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;              /* clips the image into a circle */
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(47, 107, 79, 0.1);   /* soft fallback tint */
  border: 3px solid #8FC1A3;            /* subtle ring, matches site theme */
  box-shadow: 0 8px 24px rgba(21, 43, 58, 0.12);
}

.ab-founder-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;             /* fills the circle without distortion */
  object-position: center top;   /* keeps faces well-framed */
  display: block;
}
        .ab-founder-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:22px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:6px;
          position:relative;
          z-index:1;
        }
        .ab-founder-card .role{
          font-size:14px;
          font-weight:600;
          color:var(--green);
          letter-spacing:0.02em;
          position:relative;
          z-index:1;
        }

        /* ---------- CTA ---------- */
        .ab-cta{
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          position:relative;
          overflow:hidden;
          padding:90px 0;
        }
        .ab-cta::before{
          content:'';
          position:absolute;
          top:-60%; right:-10%;
          width:60%; height:220%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.2), transparent 65%);
          pointer-events:none;
        }
        .ab-cta::after{
          content:'';
          position:absolute;
          bottom:-60%; left:-10%;
          width:50%; height:200%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.1), transparent 65%);
          pointer-events:none;
        }
        .ab-cta-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:720px;
          margin:0 auto;
        }
        .ab-cta h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(30px, 3.5vw, 42px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:18px;
        }
        .ab-cta p{
          font-size:16.5px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
          margin-bottom:36px;
        }
        .ab-cta-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:16px;
          flex-wrap:wrap;
        }
        .ab-btn-white{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:#fff;
          color:var(--green-deep);
          font-size:15.5px;
          font-weight:700;
          padding:16px 32px;
          border-radius:6px;
          border:none;
          cursor:pointer;
          text-decoration:none;
          transition:transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(0,0,0,0.15);
          font-family:'Inter', sans-serif;
        }
        .ab-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }
        .ab-btn-outline-white{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:transparent;
          color:#fff;
          font-size:15.5px;
          font-weight:600;
          padding:16px 32px;
          border-radius:6px;
          border:1.5px solid rgba(255,255,255,0.4);
          cursor:pointer;
          text-decoration:none;
          transition:background 0.2s ease, border-color 0.2s ease;
          font-family:'Inter', sans-serif;
        }
        .ab-btn-outline-white:hover{
          background:rgba(255,255,255,0.1);
          border-color:rgba(255,255,255,0.7);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .ab-container{ padding:0 32px; }
          .ab-hero{ padding:110px 0 80px; }
          .ab-story-grid{ grid-template-columns:1fr; gap:48px; }
          .ab-story-image{ height:420px; }
          .ab-stats-grid{ grid-template-columns:repeat(2, 1fr); }
          .ab-mv-grid{ grid-template-columns:1fr; }
          .ab-values-grid{ grid-template-columns:repeat(2, 1fr); }
          .ab-founders-grid{ grid-template-columns:1fr; }
        }
        @media (max-width: 640px){
          .ab-container{ padding:0 22px; }
          .ab-section{ padding:72px 0; }
          .ab-hero{ padding:90px 0 70px; }
          .ab-story-image{ height:340px; }
          .ab-story-content h2{ font-size:26px; }
          .ab-stats-grid{ grid-template-columns:1fr; }
          .ab-stat-card .num{ font-size:36px; }
          .ab-mv-card{ padding:32px 26px; }
          .ab-values-grid{ grid-template-columns:1fr; }
          .ab-cta-actions{ flex-direction:column; }
          .ab-btn-white, .ab-btn-outline-white{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .ab-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="ab-page">

        {/* ============ PAGE HERO ============ */}
        <section className="ab-hero">
          <div className="ab-hero-inner">
            <span className="ab-eyebrow"><span className="dot"></span> Who We Are</span>
            <h1>About <span className="accent">Us</span></h1>
            <p>
              Raising Leaders of Generation is a youth-centred advocacy dedicated to nurturing
              the leading spirit in young people — today, not tomorrow.
            </p>
          </div>
        </section>

        {/* ============ OUR STORY ============ */}
        <section className="ab-section">
          <div className="ab-container">
            <div className="ab-story-grid">

              {/* Background image applied here */}
              <div className="ab-story-image">
                <div className="ab-story-badge">
                  <span className="num">2025</span>
                  <span className="lbl">Founded</span>
                </div>
              </div>

              <div className="ab-story-content">
                <span className="ab-eyebrow"><span className="dot"></span> Our Story</span>
                <h2>A movement for the next generation.</h2>

                <p>
                  Founded in <strong>2025</strong> by Joshua Chriss Kwikiriza and David Mbaine,
                  our organization was born from a simple but urgent conviction: young people
                  are not future leaders — they are leaders today, waiting to be awakened.
                </p>
                <p>
                  Through school clubs, debates, bootcamps, and community projects, we help
                  students discover their voice, sharpen their character, and take real
                  responsibility for their communities.
                </p>

                <div className="ab-story-quote">
                  <span className="quote-mark">&ldquo;</span>
                  <p>
                    There is a gap in understanding the dynamics and mysteries of leadership
                    responsibilities, especially in young people. We fill that gap.
                  </p>
                </div>

                <div className="ab-story-actions">
                  <Link to="/getinvolved" className="ab-btn-primary">
                    Join the Movement
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link to="/contact" className="ab-btn-outline">
                    Contact Us
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============ STATS ============ */}
        <section className="ab-section ab-stats-section">
          <div className="ab-container">
            <div className="ab-section-head center">
              <span className="ab-eyebrow"><span className="dot"></span> By The Numbers</span>
              <h2>Growing every single day</h2>
              <p>Our impact is measured not just in numbers, but in transformed lives and communities.</p>
            </div>

            <div className="ab-stats-grid">
              <div className="ab-stat-card">
                <div className="num">50<span className="plus">+</span></div>
                <div className="lbl">Active Members</div>
              </div>
              <div className="ab-stat-card">
                <div className="num">10<span className="plus">+</span></div>
                <div className="lbl">Dedicated Volunteers</div>
              </div>
              <div className="ab-stat-card">
                <div className="num">20<span className="plus">+</span></div>
                <div className="lbl">Schools Reached</div>
              </div>
              <div className="ab-stat-card">
                <div className="num">3</div>
                <div className="lbl">Core Programs</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ MISSION & VISION ============ */}
        <section className="ab-section">
          <div className="ab-container">
            <div className="ab-section-head center">
              <span className="ab-eyebrow"><span className="dot"></span> Purpose &amp; Direction</span>
              <h2>Our mission and vision</h2>
              <p>Two guiding statements that shape every decision, program, and partnership.</p>
            </div>

            <div className="ab-mv-grid">
              <div className="ab-mv-card">
                <div className="ab-mv-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To nurture prominent leaders with absolute qualities, moral integrity,
                  and resilience — through mentoring, training, and real-world projects
                  that build confident, responsible young people.
                </p>
              </div>

              <div className="ab-mv-card">
                <div className="ab-mv-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3>Our Vision</h3>
                <p>
                  A generation of empowered young leaders influencing governance, business,
                  and social change across Rwanda — and eventually across all of Africa.
                </p>
              </div>
            </div>

            <div className="ab-values-grid">
              <div className="ab-value-card">
                <div className="ab-value-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <h4>Mental Transformation</h4>
                <p>Building a leader from the inside out.</p>
              </div>

              <div className="ab-value-card">
                <div className="ab-value-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87" />
                  </svg>
                </div>
                <h4>Social Impact</h4>
                <p>Service through clubs and community projects.</p>
              </div>

              <div className="ab-value-card">
                <div className="ab-value-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                  </svg>
                </div>
                <h4>Public Speaking</h4>
                <p>Voice, confidence, and clear expression.</p>
              </div>

              <div className="ab-value-card">
                <div className="ab-value-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h4>Moral Integrity</h4>
                <p>Character and values as the foundation.</p>
              </div>
            </div>
          </div>
        </section>
{/* ============ FOUNDERS ============ */}
<section className="ab-section ab-founders-section">
  <div className="ab-container">
    <div className="ab-section-head center">
      <span className="ab-eyebrow"><span className="dot"></span> Leadership</span>
      <h2>Meet our founders</h2>
      <p>Visionaries who turned a shared conviction into a growing movement.</p>
    </div>

    <div className="ab-founders-grid">
      <div className="ab-founder-card">
        <div className="ab-founder-avatar">
          <img src={founder} alt="Joshua Chriss Kwikiriza" />
        </div>
        <h3>Joshua Chriss Kwikiriza</h3>
        <p className="role">Founder &amp; Executive Director</p>
      </div>

      <div className="ab-founder-card">
        <div className="ab-founder-avatar">
          <img src={founder} alt="David Mbaine" />
        </div>
        <h3>David Mbaine</h3>
        <p className="role">Co-Founder</p>
      </div>
    </div>
  </div>
</section>

        {/* ============ CTA ============ */}
        <section className="ab-cta">
          <div className="ab-container">
            <div className="ab-cta-inner">
              <h2>Want to learn more about us?</h2>
              <p>
                Reach out to our team — we'd love to connect your school or organization
                with our growing movement.
              </p>
              <div className="ab-cta-actions">
                <Link to="/getinvolved" className="ab-btn-white">
                  Get Involved
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link to="/programs" className="ab-btn-outline-white">
                  View Our Programs
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}