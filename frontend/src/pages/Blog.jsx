import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// --- IMPORT LOCAL ASSETS ---
import event1 from '../assets/event-1.jpg';
import event2 from '../assets/event-2.jpg';
import event3 from '../assets/event-3.jpg';
import heroBg from '../assets/hero-bg.jpg';
import heroImage from '../assets/hero-image.png';
import hero from '../assets/hero.png';
import programIcon1 from '../assets/program-icon-1.png';
import programIcon2 from '../assets/program-icon-2.png';
import programIcon3 from '../assets/program-icon-3.png';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- Fallback posts (used if API fails) ---------- */
const fallbackPosts = [
  {
    _id: "f1",
    slug: "five-habits-good-leaders",
    category: "Leadership Tips",
    title: "Five Habits That Separate Good Leaders From Great Ones",
    excerpt:
      "Great leadership isn't about charisma or title — it's about consistent, small daily choices. Here are five habits our mentors teach every cohort, and why they compound into extraordinary impact over time.",
    author: { name: "Editorial Team" },
    publishedAt: "2026-03-12",
    // Changed to local image
    image: event1,
    featured: true,
  },
  {
    _id: "f2",
    slug: "regional-debate-championship",
    category: "Events",
    title: "Regional Debate Championship Draws Record 40 Schools",
    excerpt:
      "Our annual Light the Flame debate competition brought together over 400 students from across the region for three days of fierce, respectful, and inspiring public speaking.",
    author: { name: "RLG Team" },
    publishedAt: "2026-03-04",
    // Changed to local image
    image: event2,
  },
  {
    _id: "f3",
    slug: "from-shy-student-to-president",
    category: "Student Stories",
    title: "From Shy Student to Student Council President",
    excerpt:
      "Two years ago, Amina couldn't speak in front of her class. Today, she leads a council of 30 students. This is her story — and what she wants every young person to know.",
    author: { name: "Amara Okafor" },
    publishedAt: "2026-02-26",
    // Changed to local image
    image: event3,
  },
  {
    _id: "f4",
    slug: "new-partnership-12-schools",
    category: "Partnerships",
    title: "New Partnership Expands Our Reach to 12 More Schools",
    excerpt:
      "We're thrilled to announce a new partnership that will bring our leadership programs to 12 additional schools, reaching nearly 2,000 more students in the coming year.",
    author: { name: "RLG Team" },
    publishedAt: "2026-02-18",
    // Changed to local image
    image: heroBg,
  },
  {
    _id: "f5",
    slug: "applications-open-2026-bootcamp",
    category: "Announcements",
    title: "Applications Open for Our 2026 Leadership Bootcamp",
    excerpt:
      "Our flagship two-week leadership bootcamp is back. Applications are now open for students aged 14–18 who are ready to step into their leadership potential.",
    author: { name: "RLG Team" },
    publishedAt: "2026-02-10",
    // Changed to local image
    image: heroImage,
  },
  {
    _id: "f6",
    slug: "rlg-clubs-reshaping-culture",
    category: "Programs",
    title: "How Our RLG Clubs Are Reshaping School Culture",
    excerpt:
      "Student-led clubs are at the heart of everything we do. Here's a look at how three schools have transformed their culture through our RLG Clubs program.",
    author: { name: "Editorial Team" },
    publishedAt: "2026-01-30",
    // Changed to local image
    image: hero,
  },
];

const categories = [
  "All",
  "Leadership Tips",
  "Events",
  "Student Stories",
  "Partnerships",
  "Announcements",
  "Programs",
];

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Blog() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API_URL}/blogs?limit=50`);
        const d = await r.json();
        const items = (d.data?.blogs || []).filter((b) => b.status === "published");
        setPosts(items.length ? items : fallbackPosts);
      } catch {
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = posts.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch =
      !searchTerm || (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{`
        /* ============================================================
           BLOG PAGE — matches HTML exactly
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

        .bl-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .bl-page *{ box-sizing:border-box; }
        .bl-page img{ max-width:100%; display:block; }

        .bl-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .bl-section{
          padding:100px 0;
          position:relative;
        }

        .bl-eyebrow{
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
        .bl-eyebrow .dot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .bl-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
          text-align:center;
        }
        .bl-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.22), transparent 65%);
          pointer-events:none;
        }
        .bl-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .bl-hero-inner{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .bl-hero .bl-eyebrow{
          color:var(--green-light);
          justify-content:center;
        }
        .bl-hero h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 60px);
          line-height:1.1;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .bl-hero h1 .accent{ color:var(--gold); }
        .bl-hero p{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.82);
          max-width:620px;
          margin:0 auto;
        }

        /* ---------- Filter Bar ---------- */
        .bl-filter-bar{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          flex-wrap:wrap;
          margin-bottom:48px;
          padding-bottom:32px;
          border-bottom:1px solid var(--line);
        }
        .bl-category-tabs{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }
        .bl-category-tab{
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
        .bl-category-tab:hover{
          border-color:var(--green);
          color:var(--green);
        }
        .bl-category-tab.active{
          background:var(--green);
          border-color:var(--green);
          color:#fff;
          box-shadow:0 4px 12px rgba(47,107,79,0.28);
        }

        .bl-search-box{
          position:relative;
          min-width:260px;
          flex:1 1 260px;
          max-width:340px;
        }
        .bl-search-box input{
          width:100%;
          padding:12px 18px 12px 44px;
          border-radius:100px;
          border:1.5px solid var(--line);
          background:#fff;
          font-size:14px;
          font-family:'Inter', sans-serif;
          color:var(--text);
          outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .bl-search-box input:focus{
          border-color:var(--green);
          box-shadow:0 0 0 3px rgba(47,107,79,0.12);
        }
        .bl-search-box input::placeholder{ color:#9AA0A6; }
        .bl-search-box svg{
          position:absolute;
          left:16px; top:50%;
          transform:translateY(-50%);
          width:16px; height:16px;
          stroke:var(--text-soft);
          fill:none;
          stroke-width:2;
          stroke-linecap:round;
          stroke-linejoin:round;
          pointer-events:none;
        }

        /* ---------- Blog Grid ---------- */
        .bl-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:28px;
        }
        .bl-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          overflow:hidden;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          display:flex;
          flex-direction:column;
        }
        .bl-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.14);
        }
        .bl-card-img{
          height:210px;
          overflow:hidden;
          position:relative;
          background:linear-gradient(135deg, var(--navy), var(--green-deep));
        }
        .bl-card-img img{
          width:100%; height:100%;
          object-fit:cover;
          transition:transform 0.5s ease;
        }
        .bl-card:hover .bl-card-img img{
          transform:scale(1.06);
        }
        .bl-card-category{
          position:absolute;
          top:16px; left:16px;
          background:rgba(15,33,45,0.85);
          backdrop-filter:blur(8px);
          color:#fff;
          font-size:11px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          padding:6px 12px;
          border-radius:100px;
          z-index:2;
        }
        .bl-card-body{
          padding:24px 24px 26px;
          flex:1;
          display:flex;
          flex-direction:column;
        }
        .bl-card-meta{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          font-size:12.5px;
          color:var(--text-soft);
          margin-bottom:14px;
        }
        .bl-card-meta .date{
          display:inline-flex;
          align-items:center;
          gap:5px;
        }
        .bl-card-meta .date svg{
          width:13px; height:13px;
          stroke:var(--text-soft);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .bl-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:18px;
          font-weight:600;
          color:var(--navy);
          line-height:1.4;
          margin-bottom:12px;
          transition:color 0.2s ease;
        }
        .bl-card:hover h3{
          color:var(--green);
        }
        .bl-card .excerpt{
          font-size:14px;
          color:var(--text-soft);
          line-height:1.65;
          margin-bottom:20px;
          flex:1;
        }
        .bl-card-footer{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding-top:16px;
          border-top:1px solid var(--line);
        }
        .bl-author{
          display:inline-flex;
          align-items:center;
          gap:6px;
          font-size:12.5px;
          color:var(--text-soft);
        }
        .bl-author svg{
          width:13px; height:13px;
          stroke:var(--text-soft);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .bl-read-link{
          display:inline-flex;
          align-items:center;
          gap:6px;
          font-size:13px;
          font-weight:700;
          color:var(--green);
          text-decoration:none;
          transition:gap 0.2s ease, color 0.2s ease;
        }
        .bl-read-link:hover{
          gap:10px;
          color:var(--green-bright);
        }
        .bl-read-link svg{
          width:13px; height:13px;
          stroke:currentColor;
          fill:none;
          stroke-width:2.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        /* ---------- Featured (first card) ---------- */
        .bl-grid .bl-card:first-child{
          grid-column:span 2;
          flex-direction:row;
        }
        .bl-grid .bl-card:first-child .bl-card-img{
          width:50%;
          height:auto;
          min-height:340px;
          flex-shrink:0;
        }
        .bl-grid .bl-card:first-child .bl-card-body{
          width:50%;
          padding:36px 36px 32px;
        }
        .bl-grid .bl-card:first-child h3{
          font-size:24px;
        }
        .bl-grid .bl-card:first-child .excerpt{
          font-size:15px;
        }

        /* ---------- Empty state ---------- */
        .bl-empty{
          text-align:center;
          padding:80px 24px;
          background:#fff;
          border:1px dashed var(--line);
          border-radius:16px;
        }
        .bl-empty svg{
          width:48px; height:48px;
          stroke:var(--green-light);
          fill:none;
          stroke-width:1.5;
          margin-bottom:16px;
        }
        .bl-empty p{
          font-size:15px;
          color:var(--text-soft);
        }

        /* ---------- Pagination ---------- */
        .bl-pagination{
          display:flex;
          justify-content:center;
          gap:8px;
          margin-top:56px;
        }
        .bl-pagination .bl-category-tab{
          min-width:44px;
          justify-content:center;
        }

        /* ---------- CTA ---------- */
        .bl-cta{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          position:relative;
          overflow:hidden;
          padding:80px 0;
        }
        .bl-cta::before{
          content:'';
          position:absolute;
          top:-60%; right:-10%;
          width:60%; height:220%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.15), transparent 65%);
          pointer-events:none;
        }
        .bl-cta-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:720px;
          margin:0 auto;
        }
        .bl-cta h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(30px, 3.5vw, 42px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:18px;
        }
        .bl-cta p{
          font-size:16.5px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
          margin-bottom:36px;
        }
        .bl-cta-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:16px;
          flex-wrap:wrap;
        }
        .bl-btn-white{
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
        .bl-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }
        .bl-btn-outline-white{
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
        .bl-btn-outline-white:hover{
          background:rgba(255,255,255,0.1);
          border-color:rgba(255,255,255,0.7);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .bl-container{ padding:0 32px; }
          .bl-hero{ padding:110px 0 80px; }
          .bl-grid{ grid-template-columns:repeat(2, 1fr); }
          .bl-grid .bl-card:first-child{
            grid-column:span 2;
            flex-direction:column;
          }
          .bl-grid .bl-card:first-child .bl-card-img{
            width:100%;
            height:240px;
            min-height:0;
          }
          .bl-grid .bl-card:first-child .bl-card-body{
            width:100%;
            padding:28px 26px 30px;
          }
          .bl-grid .bl-card:first-child h3{
            font-size:20px;
          }
          .bl-filter-bar{
            flex-direction:column;
            align-items:stretch;
          }
          .bl-search-box{ max-width:100%; }
        }
        @media (max-width: 640px){
          .bl-container{ padding:0 22px; }
          .bl-section{ padding:72px 0; }
          .bl-hero{ padding:90px 0 70px; }
          .bl-grid{ grid-template-columns:1fr; }
          .bl-grid .bl-card:first-child{ grid-column:span 1; }
          .bl-category-tabs{ justify-content:center; }
          .bl-cta-actions{ flex-direction:column; }
          .bl-btn-white, .bl-btn-outline-white{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .bl-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="bl-page">

        {/* ============ PAGE HERO ============ */}
        <section className="bl-hero">
          <div className="bl-hero-inner">
            <span className="bl-eyebrow"><span className="dot"></span> Insights &amp; Updates</span>
            <h1>News &amp; <span className="accent">Blog</span></h1>
            <p>
              Stories, insights, and updates from our community — leadership tips,
              events, student stories, and more.
            </p>
          </div>
        </section>

        {/* ============ BLOG LISTING ============ */}
        <section className="bl-section">
          <div className="bl-container">

            {/* ---------- Filter Bar ---------- */}
            <div className="bl-filter-bar">
              <div className="bl-category-tabs">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`bl-category-tab ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="bl-search-box">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* ---------- Blog Grid ---------- */}
            {loading ? (
              <div className="bl-empty">
                <p>Loading articles...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bl-empty">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" />
                </svg>
                <p>No articles found. Try a different category or search term.</p>
              </div>
            ) : (
              <div className="bl-grid">
                {filtered.map((b) => (
                  <article key={b._id} className="bl-card">
                    <div className="bl-card-img">
                      {/* Using local images now */}
                      <img src={b.image} alt={b.title} />
                      <span className="bl-card-category">
                        {b.category || "News"}
                      </span>
                    </div>
                    <div className="bl-card-body">
                      <div className="bl-card-meta">
                        <span>By {b.author?.name || "RLG Team"}</span>
                        <span className="date">
                          <svg viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          {formatDate(b.publishedAt || b.createdAt)}
                        </span>
                      </div>
                      <h3>{b.title}</h3>
                      <p className="excerpt">{b.excerpt}</p>
                      <div className="bl-card-footer">
                        <span className="bl-author">
                          <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                          </svg>
                          {b.author?.name || "RLG Team"}
                        </span>
                        <Link to={`/blog/${b.slug}`} className="bl-read-link">
                          Read Article
                          <svg viewBox="0 0 24 24">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* ---------- Pagination ---------- */}
            {!loading && filtered.length > 0 && (
              <div className="bl-pagination">
                <button className="bl-category-tab active">1</button>
                <button className="bl-category-tab">2</button>
                <button className="bl-category-tab">3</button>
                <button className="bl-category-tab">→</button>
              </div>
            )}

          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="bl-cta">
          <div className="bl-container">
            <div className="bl-cta-inner">
              <h2>Never miss an update</h2>
              <p>
                Get stories of impact, leadership insights, and event announcements
                delivered straight to your inbox.
              </p>
              <div className="bl-cta-actions">
                <Link to="/contact" className="bl-btn-white">
                  Subscribe to Newsletter
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
                <Link to="/getinvolved" className="bl-btn-outline-white">
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}