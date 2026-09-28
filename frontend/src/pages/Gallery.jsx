import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- IMPORT LOCAL ASSETS ---
import event1 from '../assets/event-1.jpg';
import event2 from '../assets/event-2.jpg';
import event3 from '../assets/event-3.jpg';
import heroBg from '../assets/hero-bg.jpg';
import heroImage from '../assets/hero-image.png';
import hero from '../assets/hero.png';
import aboutImage from '../assets/about-image.jpg';
import dotsPattern from '../assets/dots-pattern.png';
import footerLogo from '../assets/footer-logo.png';
import logo from '../assets/logo.png';
import patternBg from '../assets/pattern-bg.svg';
import programIcon1 from '../assets/program-icon-1.png';
import programIcon2 from '../assets/program-icon-2.png';
import programIcon3 from '../assets/program-icon-3.png';
import reactSvg from '../assets/react.svg';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- Fallback gallery items (used if API fails) ---------- */
const fallbackImages = [
  {
    _id: "g1",
    title: "School Leadership Bootcamp",
    category: "School Leadership Bootcamps",
    date: "May 10, 2025",
    location: "Kigali, Rwanda",
    likes: 128,
    views: 512,
    // Changed to local image
    image: event1,
  },
  {
    _id: "g2",
    title: "Light the Flame Debates",
    category: "Light the Flame Debates",
    date: "April 28, 2025",
    location: "Kigali, Rwanda",
    likes: 214,
    views: 896,
    // Changed to local image
    image: event2,
  },
  {
    _id: "g3",
    title: "RLG Green Life Project",
    category: "RLG Green Life",
    date: "April 15, 2025",
    location: "Kigali, Rwanda",
    likes: 176,
    views: 643,
    // Changed to local image
    image: event3,
  },
  {
    _id: "g4",
    title: "Leadership Forum Summit",
    category: "Leadership Forums",
    date: "March 30, 2025",
    location: "Kigali, Rwanda",
    likes: 302,
    views: 1204,
    // Changed to local image
    image: heroBg,
  },
  {
    _id: "g5",
    title: "Oasis of Wealth Awards",
    category: "Oasis of Wealth Awards",
    date: "March 12, 2025",
    location: "Kigali, Rwanda",
    likes: 245,
    views: 922,
    // Changed to local image
    image: heroImage,
  },
  {
    _id: "g6",
    title: "Youth Mentorship Session",
    category: "Leadership Forums",
    date: "February 20, 2025",
    location: "Kigali, Rwanda",
    likes: 189,
    views: 734,
    // Changed to local image
    image: hero,
  },
];

const fallbackCategories = [
  "All",
  "School Leadership Bootcamps",
  "Light the Flame Debates",
  "RLG Green Life",
  "Leadership Forums",
  "Oasis of Wealth Awards",
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/gallery`);
        const d = await r.json();
        setImages(d.data && d.data.length > 0 ? d.data : fallbackImages);
      } catch {
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const categories =
    images.length > 0
      ? ["All", ...new Set(images.map((i) => i.category).filter(Boolean))]
      : fallbackCategories;

  const filtered =
    category === "All" ? images : images.filter((i) => i.category === category);

  return (
    <>
      <style>{`
        /* ============================================================
           GALLERY PAGE — matches HTML exactly
           ============================================================ */
        :root{
          --navy:#152B3A;
          --navy-deep:#0F212D;
          --green:#2F6B4F;
          --green-deep:#234F3B;
          --green-light:#8FC1A3;
          --green-bright:#3F8C63;
          --gold:#F2C94C;
          --paper:#FAF8F4;
          --paper-dim:#F1EDE3;
          --line:#E4DFD3;
          --text:#3A3F42;
          --text-soft:#6B7178;
        }

        .gl-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .gl-page *{ box-sizing:border-box; }
        .gl-page img{ max-width:100%; display:block; }

        .gl-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .gl-section{
          padding:100px 0;
          position:relative;
        }

        .gl-eyebrow{
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
        .gl-eyebrow .dot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .gl-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
          text-align:center;
        }
        .gl-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.22), transparent 65%);
          pointer-events:none;
        }
        .gl-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .gl-hero-inner{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .gl-hero .gl-eyebrow{
          color:var(--green-light);
          justify-content:center;
        }
        .gl-hero h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 60px);
          line-height:1.1;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .gl-hero h1 .accent{ color:var(--gold); }
        .gl-hero p{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.82);
          max-width:620px;
          margin:0 auto;
        }

        /* ---------- Category Filter ---------- */
        .gl-category-filter{
          display:flex;
          justify-content:center;
          flex-wrap:wrap;
          gap:10px;
          margin-bottom:48px;
        }
        .gl-category-tab{
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:9px 18px;
          border-radius:100px;
          border:1.5px solid var(--line);
          background:#fff;
          color:var(--green-deep);
          font-size:13px;
          font-weight:600;
          font-family:'Inter', sans-serif;
          cursor:pointer;
          transition:all 0.2s ease;
          white-space:nowrap;
        }
        .gl-category-tab:hover{
          border-color:var(--green);
          color:var(--green);
        }
        .gl-category-tab.active{
          background:var(--green);
          border-color:var(--green);
          color:#fff;
          box-shadow:0 4px 12px rgba(47,107,79,0.28);
        }

        /* ---------- Gallery Grid ---------- */
        .gl-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:28px;
        }
        .gl-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          overflow:hidden;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          display:flex;
          flex-direction:column;
        }
        .gl-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.14);
        }
        .gl-img-btn{
          width:100%;
          border:none;
          cursor:pointer;
          background:none;
          padding:0;
          position:relative;
          display:block;
          overflow:hidden;
        }
        .gl-img-wrap{
          height:240px;
          position:relative;
          overflow:hidden;
          background:linear-gradient(135deg, var(--navy), var(--green-deep));
        }
        .gl-img-wrap img{
          width:100%; height:100%;
          object-fit:cover;
          transition:transform 0.6s ease;
        }
        .gl-card:hover .gl-img-wrap img{
          transform:scale(1.08);
        }
        .gl-img-overlay{
          position:absolute;
          inset:0;
          background:linear-gradient(180deg, rgba(15,33,45,0) 40%, rgba(15,33,45,0.75) 100%);
          opacity:0;
          transition:opacity 0.3s ease;
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          padding:18px;
        }
        .gl-card:hover .gl-img-overlay{
          opacity:1;
        }
        .gl-expand-icon{
          width:40px; height:40px;
          border-radius:50%;
          background:rgba(255,255,255,0.95);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-left:auto;
        }
        .gl-expand-icon svg{
          width:16px; height:16px;
          stroke:var(--navy);
          fill:none;
          stroke-width:2.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        .gl-card-body{
          padding:22px 24px 24px;
          flex:1;
          display:flex;
          flex-direction:column;
        }
        .gl-category-badge{
          display:inline-flex;
          align-items:center;
          align-self:flex-start;
          gap:6px;
          font-size:11px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          color:var(--green);
          background:rgba(47,107,79,0.1);
          padding:5px 12px;
          border-radius:100px;
          margin-bottom:12px;
        }
        .gl-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:17px;
          font-weight:600;
          color:var(--navy);
          line-height:1.4;
          margin-bottom:14px;
          flex:1;
        }
        .gl-meta{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding-top:14px;
          border-top:1px solid var(--line);
          font-size:12.5px;
          color:var(--text-soft);
          flex-wrap:wrap;
        }
        .gl-date-location{
          display:inline-flex;
          align-items:center;
          gap:6px;
        }
        .gl-date-location svg{
          width:13px; height:13px;
          stroke:var(--text-soft);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .gl-stats{
          display:inline-flex;
          align-items:center;
          gap:12px;
        }
        .gl-stats .stat{
          display:inline-flex;
          align-items:center;
          gap:4px;
        }
        .gl-stats .stat svg{
          width:13px; height:13px;
          fill:currentColor;
          stroke:none;
        }
        .gl-stats .stat.likes svg{ fill:var(--green); }
        .gl-stats .stat.views svg{ fill:var(--text-soft); }

        /* ---------- Lightbox ---------- */
        .gl-lightbox{
          position:fixed;
          inset:0;
          background:rgba(6,15,22,0.9);
          z-index:2000;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          opacity:0;
          visibility:hidden;
          transition:opacity 0.25s ease, visibility 0.25s ease;
          backdrop-filter:blur(6px);
        }
        .gl-lightbox.open{
          opacity:1;
          visibility:visible;
        }
        .gl-lightbox-close{
          position:absolute;
          top:24px; right:28px;
          width:44px; height:44px;
          border-radius:50%;
          background:rgba(255,255,255,0.1);
          border:1px solid rgba(255,255,255,0.2);
          color:#fff;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          transition:background 0.2s ease, transform 0.2s ease;
        }
        .gl-lightbox-close:hover{
          background:rgba(255,255,255,0.2);
          transform:rotate(90deg);
        }
        .gl-lightbox-close svg{
          width:18px; height:18px;
          stroke:currentColor;
          fill:none;
          stroke-width:2.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .gl-lightbox-inner{
          max-width:900px;
          width:100%;
          position:relative;
        }
        .gl-lightbox-image{
          width:100%;
          max-height:70vh;
          border-radius:12px;
          overflow:hidden;
          position:relative;
          background:var(--navy-deep);
          box-shadow:0 24px 64px rgba(0,0,0,0.5);
        }
        .gl-lightbox-image img{
          width:100%;
          height:100%;
          max-height:70vh;
          object-fit:cover;
          display:block;
        }
        .gl-lightbox-caption{
          margin-top:20px;
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:24px;
          flex-wrap:wrap;
          color:rgba(255,255,255,0.9);
        }
        .gl-lightbox-caption .title{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:22px;
          font-weight:600;
          color:#fff;
          margin-bottom:8px;
        }
        .gl-lightbox-caption .meta{
          display:flex;
          gap:20px;
          flex-wrap:wrap;
          font-size:13.5px;
          color:rgba(255,255,255,0.72);
        }
        .gl-lightbox-caption .meta span{
          display:inline-flex;
          align-items:center;
          gap:6px;
        }
        .gl-lightbox-caption .meta svg{
          width:14px; height:14px;
          stroke:var(--green-light);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        /* ---------- CTA ---------- */
        .gl-cta{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          position:relative;
          overflow:hidden;
          padding:80px 0;
        }
        .gl-cta::before{
          content:'';
          position:absolute;
          top:-60%; right:-10%;
          width:60%; height:220%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.15), transparent 65%);
          pointer-events:none;
        }
        .gl-cta-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:720px;
          margin:0 auto;
        }
        .gl-cta h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(30px, 3.5vw, 42px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:18px;
        }
        .gl-cta p{
          font-size:16.5px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
          margin-bottom:36px;
        }
        .gl-cta-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:16px;
          flex-wrap:wrap;
        }
        .gl-btn-white{
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
        .gl-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }
        .gl-btn-outline-white{
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
        .gl-btn-outline-white:hover{
          background:rgba(255,255,255,0.1);
          border-color:rgba(255,255,255,0.7);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .gl-container{ padding:0 32px; }
          .gl-hero{ padding:110px 0 80px; }
          .gl-grid{ grid-template-columns:repeat(2, 1fr); }
        }
        @media (max-width: 640px){
          .gl-container{ padding:0 22px; }
          .gl-section{ padding:72px 0; }
          .gl-hero{ padding:90px 0 70px; }
          .gl-grid{ grid-template-columns:1fr; }
          .gl-lightbox-close{ top:16px; right:16px; }
          .gl-cta-actions{ flex-direction:column; }
          .gl-btn-white, .gl-btn-outline-white{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .gl-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="gl-page">

        {/* ============ PAGE HERO ============ */}
        <section className="gl-hero">
          <div className="gl-hero-inner">
            <span className="gl-eyebrow"><span className="dot"></span> Visual Stories</span>
            <h1>Our <span className="accent">Gallery</span></h1>
            <p>
              A look into our events, clubs, and community impact across Rwanda —
              captured in moments that matter.
            </p>
          </div>
        </section>

        {/* ============ GALLERY ============ */}
        <section className="gl-section">
          <div className="gl-container">

            {/* Category Filter */}
            <div className="gl-category-filter">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`gl-category-tab ${category === c ? "active" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#6B7178" }}>
                Loading gallery...
              </div>
            ) : (
              <div className="gl-grid">
                {filtered.map((img) => (
                  <article key={img._id || img.title} className="gl-card">
                    <button
                      className="gl-img-btn"
                      onClick={() => setActive(img)}
                      aria-label={`View ${img.title}`}
                    >
                      <div className="gl-img-wrap">
                        {/* Using local images now */}
                        <img src={img.image || img.url} alt={img.title} />
                        <div className="gl-img-overlay">
                          <span className="gl-expand-icon">
                            <svg viewBox="0 0 24 24">
                              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="gl-card-body">
                      <span className="gl-category-badge">{img.category}</span>
                      <h3>{img.title}</h3>
                      <div className="gl-meta">
                        <span className="gl-date-location">
                          <svg viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          {img.date}
                        </span>
                        <span className="gl-stats">
                          <span className="stat likes">
                            <svg viewBox="0 0 24 24">
                              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                            {img.likes || 0}
                          </span>
                          <span className="stat views">
                            <svg viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" fill="#fff" />
                            </svg>
                            {img.views || 0}
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="gl-cta">
          <div className="gl-container">
            <div className="gl-cta-inner">
              <h2>Be part of the next story</h2>
              <p>
                Every image here started with someone deciding to show up. Join us at
                our next event, volunteer, or bring our programs to your school.
              </p>
              <div className="gl-cta-actions">
                <Link to="/getinvolved" className="gl-btn-white">
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
                <Link to="/programs" className="gl-btn-outline-white">
                  View Our Programs
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ============ LIGHTBOX ============ */}
      <div
        className={`gl-lightbox ${active ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <button
          className="gl-lightbox-close"
          aria-label="Close"
          onClick={() => setActive(null)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {active && (
          <div className="gl-lightbox-inner">
            <div className="gl-lightbox-image">
              <img src={active.image || active.url} alt={active.title} />
            </div>
            <div className="gl-lightbox-caption">
              <div>
                <div className="title">{active.title}</div>
                <div className="meta">
                  <span>
                    <svg viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{active.location || "Kigali, Rwanda"}</span>
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    <span>{active.date}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}