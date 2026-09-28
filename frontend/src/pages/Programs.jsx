import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- IMPORT LOCAL ASSETS ---
import event1 from '../assets/event-1.jpg';
import event2 from '../assets/event-2.jpg';
import event3 from '../assets/event-3.jpg';
import programIcon1 from '../assets/program-icon-1.png';
import programIcon2 from '../assets/program-icon-2.png';
import programIcon3 from '../assets/program-icon-3.png';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- Fallback data (used if API fails) ---------- */
const fallbackPrograms = [
  {
    tag: "Leadership",
    // Changed to use local icon (passed as a string to match your dangerouslySetInnerHTML structure)
    // Note: If you want to use the image file directly, we would need to change the JSX render.
    // For now, I am keeping the SVG structure but you can swap to <img> if preferred.
    icon: `<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    title: "School Leadership Development",
    description:
      "Trainings and mentoring for students through student councils and leadership bootcamps.",
    subPrograms: [
      { name: "RLG Clubs", description: "School-based clubs coordinated by RLG" },
      { name: "RLG Green Life", description: "Environment and sustainability projects" },
      { name: "RLG Impact", description: "Community impact initiatives" },
    ],
    // Changed to local image
    image: event1,
  },
  {
    tag: "Competitions",
    icon: `<svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>`,
    title: "Tournaments & Competitions",
    description:
      "Debate, public speaking, interschool challenges, and leadership awards.",
    subPrograms: [
      { name: "Light the Flame", description: "Debate and public speaking competition" },
      { name: "Oasis of Wealth", description: "Entrepreneurship and leadership awards" },
    ],
    // Changed to local image
    image: event2,
  },
  {
    tag: "Forums",
    icon: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87"/></svg>`,
    title: "Leadership Forums & Conferences",
    description:
      "Summits and forums on governance, entrepreneurship, and networking platforms.",
    subPrograms: [
      { name: "My Role", description: "Personal responsibility and citizenship" },
      { name: "My Heritage", description: "Culture, identity, and values" },
    ],
    // Changed to local image
    image: event3,
  },
];

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/programs`);
        const d = await r.json();
        const items =
          d.data && d.data.length > 0
            ? d.data.map((p, i) => ({
                ...fallbackPrograms[i % fallbackPrograms.length],
                ...p,
              }))
            : fallbackPrograms;
        setPrograms(items);
      } catch {
        setPrograms(fallbackPrograms);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <style>{`
        /* ============================================================
           PROGRAMS PAGE — matches HTML exactly
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

        .pg-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          line-height:1.5;
        }

        .pg-page *{ box-sizing:border-box; }
        .pg-page img{ max-width:100%; display:block; }

        .pg-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }

        .pg-section{
          padding:100px 0;
          position:relative;
        }

        .pg-section-head{
          max-width:640px;
          margin-bottom:56px;
        }
        .pg-section-head.center{
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .pg-section-head h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(32px, 3.5vw, 44px);
          line-height:1.15;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:16px;
        }
        .pg-section-head p{
          font-size:16px;
          color:var(--text-soft);
          line-height:1.7;
        }

        .pg-eyebrow{
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
        .pg-eyebrow .dot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .pg-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
          text-align:center;
        }
        .pg-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.22), transparent 65%);
          pointer-events:none;
        }
        .pg-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .pg-hero-inner{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .pg-hero .pg-eyebrow{
          color:var(--green-light);
          justify-content:center;
        }
        .pg-hero h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 60px);
          line-height:1.1;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .pg-hero h1 .accent{ color:var(--gold); }
        .pg-hero p{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.82);
          max-width:600px;
          margin:0 auto;
        }

        /* ---------- Intro ---------- */
        .pg-intro{
          background:var(--paper);
          padding:80px 0 40px;
        }
        .pg-intro-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:64px;
          align-items:center;
        }
        .pg-intro-content h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 38px);
          line-height:1.18;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:20px;
        }
        .pg-intro-content p{
          font-size:16px;
          color:var(--text-soft);
          line-height:1.75;
          margin-bottom:24px;
        }
        .pg-intro-stats{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:24px;
        }
        .pg-intro-stat{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          padding:28px 24px;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
        }
        .pg-intro-stat:hover{
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(21,43,58,0.1);
        }
        .pg-intro-stat .icon{
          width:48px; height:48px;
          border-radius:10px;
          background:linear-gradient(135deg, rgba(47,107,79,0.14), rgba(63,140,99,0.08));
          display:flex; align-items:center; justify-content:center;
          margin-bottom:16px;
        }
        .pg-intro-stat .icon svg{
          width:22px; height:22px;
          stroke:var(--green); fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .pg-intro-stat .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:34px;
          font-weight:700;
          color:var(--navy);
          line-height:1;
          margin-bottom:6px;
        }
        .pg-intro-stat .num .plus{ color:var(--green); }
        .pg-intro-stat .lbl{
          font-size:13.5px;
          color:var(--text-soft);
          line-height:1.5;
        }

        /* ---------- Programs Grid ---------- */
        .pg-programs{
          background:linear-gradient(180deg, var(--paper) 0%, var(--paper-dim) 100%);
          position:relative;
          overflow:hidden;
        }
        .pg-programs::before{
          content:'';
          position:absolute;
          top:-10%; right:-10%;
          width:50%; height:70%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.25), transparent 70%);
          pointer-events:none;
        }
        .pg-programs-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:28px;
          position:relative;
          z-index:1;
        }
        .pg-program-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          overflow:hidden;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          display:flex;
          flex-direction:column;
        }
        .pg-program-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.14);
        }
        .pg-program-card-img{
          height:220px;
          overflow:hidden;
          position:relative;
          background:linear-gradient(135deg, var(--navy), var(--green-deep));
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .pg-program-card-img img{
          width:100%; height:100%;
          object-fit:cover;
          transition:transform 0.5s ease;
        }
        .pg-program-card:hover .pg-program-card-img img{
          transform:scale(1.06);
        }
        .pg-program-card-tag{
          position:absolute;
          top:16px; left:16px;
          background:rgba(15,33,45,0.85);
          backdrop-filter:blur(8px);
          color:#fff;
          font-size:11.5px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          padding:6px 12px;
          border-radius:100px;
          z-index:2;
        }
        .pg-program-card-body{
          padding:28px 26px 30px;
          flex:1;
          display:flex;
          flex-direction:column;
        }
        .pg-program-card-icon{
          width:48px; height:48px;
          border-radius:10px;
          background:linear-gradient(135deg, rgba(47,107,79,0.12), rgba(63,140,99,0.08));
          display:flex; align-items:center; justify-content:center;
          margin-bottom:18px;
        }
        .pg-program-card-icon svg{
          width:24px; height:24px;
          stroke:var(--green); fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .pg-program-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:20px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:10px;
          line-height:1.3;
        }
        .pg-program-card > .pg-program-card-body > p{
          font-size:14.5px;
          color:var(--text-soft);
          line-height:1.65;
          margin-bottom:18px;
        }
        .pg-program-divider{
          height:1px;
          background:var(--line);
          margin:0 0 18px;
        }
        .pg-subprograms-label{
          font-size:11.5px;
          font-weight:700;
          letter-spacing:0.12em;
          text-transform:uppercase;
          color:var(--navy);
          margin-bottom:12px;
        }
        .pg-subprograms-list{
          list-style:none;
          display:grid;
          gap:10px;
          margin-bottom:22px;
          padding:0;
        }
        .pg-subprograms-list li{
          display:flex;
          gap:10px;
          align-items:flex-start;
          font-size:13.5px;
          color:var(--text-soft);
          line-height:1.55;
        }
        .pg-subprograms-list li svg{
          width:15px; height:15px;
          stroke:var(--green); fill:none;
          stroke-width:2.4;
          stroke-linecap:round;
          stroke-linejoin:round;
          flex-shrink:0;
          margin-top:3px;
        }
        .pg-subprograms-list li b{
          color:var(--navy);
          font-weight:600;
        }
        .pg-program-card-actions{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          margin-top:auto;
        }

        .pg-btn-primary-sm{
          display:inline-flex;
          align-items:center;
          gap:8px;
          background:var(--green);
          color:#fff;
          font-size:13.5px;
          font-weight:700;
          padding:11px 20px;
          border-radius:6px;
          border:none;
          cursor:pointer;
          text-decoration:none;
          transition:background 0.2s ease, transform 0.15s ease;
          font-family:'Inter', sans-serif;
        }
        .pg-btn-primary-sm:hover{
          background:var(--green-bright);
          transform:translateY(-1px);
        }
        .pg-btn-primary-sm svg{ width:14px; height:14px; }

        .pg-btn-outline-sm{
          display:inline-flex;
          align-items:center;
          gap:8px;
          background:transparent;
          color:var(--navy);
          font-size:13.5px;
          font-weight:600;
          padding:11px 20px;
          border-radius:6px;
          border:1.5px solid var(--line);
          cursor:pointer;
          text-decoration:none;
          transition:border-color 0.2s ease, color 0.2s ease;
          font-family:'Inter', sans-serif;
        }
        .pg-btn-outline-sm:hover{
          border-color:var(--green);
          color:var(--green);
        }

        /* ---------- Approach ---------- */
        .pg-approach{ background:var(--paper); }
        .pg-approach-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:24px;
        }
        .pg-approach-item{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          padding:32px 26px;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .pg-approach-item:hover{
          transform:translateY(-4px);
          box-shadow:0 20px 44px rgba(21,43,58,0.1);
          border-color:var(--green-light);
        }
        .pg-approach-item .icon{
          width:52px; height:52px;
          border-radius:50%;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:20px;
          box-shadow:0 6px 18px rgba(47,107,79,0.3);
        }
        .pg-approach-item .icon svg{
          width:24px; height:24px;
          stroke:#fff; fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .pg-approach-item h4{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:18px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:10px;
          line-height:1.3;
        }
        .pg-approach-item p{
          font-size:14px;
          color:var(--text-soft);
          line-height:1.65;
        }

        /* ---------- CTA ---------- */
        .pg-cta{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          position:relative;
          overflow:hidden;
          padding:80px 0;
        }
        .pg-cta::before{
          content:'';
          position:absolute;
          top:-60%; right:-10%;
          width:60%; height:220%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.15), transparent 65%);
          pointer-events:none;
        }
        .pg-cta-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:720px;
          margin:0 auto;
        }
        .pg-cta h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(30px, 3.5vw, 42px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:18px;
        }
        .pg-cta p{
          font-size:16.5px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
          margin-bottom:36px;
        }
        .pg-cta-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:16px;
          flex-wrap:wrap;
        }
        .pg-btn-white{
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
        .pg-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }
        .pg-btn-outline-white{
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
        .pg-btn-outline-white:hover{
          background:rgba(255,255,255,0.1);
          border-color:rgba(255,255,255,0.7);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .pg-container{ padding:0 32px; }
          .pg-hero{ padding:110px 0 80px; }
          .pg-intro-grid{ grid-template-columns:1fr; gap:48px; }
          .pg-programs-grid{ grid-template-columns:repeat(2, 1fr); }
          .pg-approach-grid{ grid-template-columns:repeat(2, 1fr); }
        }
        @media (max-width: 640px){
          .pg-container{ padding:0 22px; }
          .pg-section{ padding:72px 0; }
          .pg-hero{ padding:90px 0 70px; }
          .pg-intro-stats{ grid-template-columns:1fr; }
          .pg-programs-grid{ grid-template-columns:1fr; }
          .pg-approach-grid{ grid-template-columns:1fr; }
          .pg-cta-actions{ flex-direction:column; }
          .pg-btn-white, .pg-btn-outline-white{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .pg-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="pg-page">

        {/* ============ PAGE HERO ============ */}
        <section className="pg-hero">
          <div className="pg-hero-inner">
            <span className="pg-eyebrow"><span className="dot"></span> What We Offer</span>
            <h1>Our <span className="accent">Programs</span></h1>
            <p>
              Three powerful initiatives designed to develop the next generation of leaders,
              strengthen communities, and create lasting change.
            </p>
          </div>
        </section>

        {/* ============ INTRO ============ */}
        <section className="pg-section pg-intro">
          <div className="pg-container">
            <div className="pg-intro-grid">

              <div className="pg-intro-content">
                <span className="pg-eyebrow"><span className="dot"></span> Our Approach</span>
                <h2>Programs that transform lives and communities.</h2>
                <p>
                  Every program we run is built on a simple belief: when young people are
                  given the tools, mentorship, and platform they deserve, they don't just
                  succeed — they lead.
                </p>
                <p>
                  From school-based clubs to national competitions, our initiatives reach
                  thousands of participants each year, creating pathways to opportunity
                  and impact that ripple far beyond the individual.
                </p>
              </div>

              <div className="pg-intro-stats">
                <div className="pg-intro-stat">
                  <div className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <div className="num">5,000<span className="plus">+</span></div>
                  <div className="lbl">Students Reached Annually</div>
                </div>

                <div className="pg-intro-stat">
                  <div className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="num">120<span className="plus">+</span></div>
                  <div className="lbl">Partner Schools</div>
                </div>

                <div className="pg-intro-stat">
                  <div className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>
                  <div className="num">45<span className="plus">+</span></div>
                  <div className="lbl">Competitions Hosted</div>
                </div>

                <div className="pg-intro-stat">
                  <div className="icon">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
                    </svg>
                  </div>
                  <div className="num">300<span className="plus">+</span></div>
                  <div className="lbl">Trained Volunteers</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============ PROGRAMS GRID ============ */}
        <section className="pg-section pg-programs">
          <div className="pg-container">
            <div className="pg-section-head center">
              <span className="pg-eyebrow"><span className="dot"></span> Three Pillars</span>
              <h2>Programs that transform</h2>
              <p>Hands-on learning, mentorship, and real responsibility for every participant.</p>
            </div>

            <div className="pg-programs-grid">
              {programs.map((p, i) => (
                <article key={i} className="pg-program-card">
                  <div className="pg-program-card-img">
                    {/* Using local images now */}
                    <img src={p.image} alt={p.title} />
                    <span className="pg-program-card-tag">{p.tag}</span>
                  </div>
                  <div className="pg-program-card-body">
                    <div
                      className="pg-program-card-icon"
                      dangerouslySetInnerHTML={{ __html: p.icon }}
                    />
                    <h3>{p.title}</h3>
                    <p>{p.description || p.longDescription}</p>

                    <div className="pg-program-divider"></div>
                    <div className="pg-subprograms-label">Sub-Programs</div>
                    <ul className="pg-subprograms-list">
                      {(p.subPrograms || []).map((s, j) => (
                        <li key={j}>
                          <svg viewBox="0 0 24 24">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span>
                            <b>{s.name}:</b> {s.description}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pg-program-card-actions">
                      <Link to="/getinvolved" className="pg-btn-primary-sm">
                        Join Now
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
                      <Link to="/contact" className="pg-btn-outline-sm">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ APPROACH ============ */}
        <section className="pg-section pg-approach">
          <div className="pg-container">
            <div className="pg-section-head center">
              <span className="pg-eyebrow"><span className="dot"></span> How We Work</span>
              <h2>A proven approach to youth leadership</h2>
              <p>Four principles guide every program we design and every partnership we build.</p>
            </div>

            <div className="pg-approach-grid">
              <div className="pg-approach-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h4>Excellence</h4>
                <p>We hold high standards for our participants, our volunteers, and ourselves.</p>
              </div>

              <div className="pg-approach-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <h4>Community</h4>
                <p>We build networks of support that continue long after a program ends.</p>
              </div>

              <div className="pg-approach-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <h4>Integrity</h4>
                <p>We operate transparently and remain accountable to the communities we serve.</p>
              </div>

              <div className="pg-approach-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h4>Impact</h4>
                <p>We measure success by the lasting difference we make in people's lives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="pg-cta">
          <div className="pg-container">
            <div className="pg-cta-inner">
              <h2>Support a young leader today</h2>
              <p>
                Your involvement helps fund clubs, debates, and bootcamps that change lives.
                Every contribution, every hour volunteered, moves us forward.
              </p>
              <div className="pg-cta-actions">
                <Link to="/getinvolved" className="pg-btn-white">
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
                <Link to="/contact" className="pg-btn-outline-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}