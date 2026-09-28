import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// --- IMPORT ALL ASSETS ---
import aboutImage from '../assets/about-image.jpg';

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
import volimg from '../assets/vol.jpeg'; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- API helpers ---------- */
const api = {
  getPrograms: async () => {
    try {
      const r = await fetch(`${API_URL}/programs`);
      const d = await r.json();
      return d.data || [];
    } catch { return []; }
  },
  getBlogs: async () => {
    try {
      const r = await fetch(`${API_URL}/blogs?limit=3`);
      const d = await r.json();
      return d.data?.blogs || [];
    } catch { return []; }
  },
  getStats: async () => {
    try {
      const r = await fetch(`${API_URL}/dashboard/stats`);
      const d = await r.json();
      return d.data || {};
    } catch { return {}; }
  },
  getTestimonials: async () => {
    try {
      const r = await fetch(`${API_URL}/testimonials`);
      const d = await r.json();
      return d.data || [];
    } catch { return []; }
  },
};

/* ---------- Fallback programs (used if API returns nothing) ---------- */
const fallbackPrograms = [
  {
    tag: "Education",
    title: "School Leadership Development",
    description:
      "Trainings and mentoring for students through student councils and leadership bootcamps.",
    image: event1, 
    iconSrc: programIcon1, 
  },
  {
    tag: "Healthcare",
    title: "Tournaments & Competitions",
    description:
      "Debate, public speaking,UN Modal,Professional Leadership Interview,interschool challenges, and leadership awards.",
    image: event2, 
    iconSrc: programIcon2, 
  },
  {
    tag: "Justice",
    title: "Leadership Forums & Conferences",
    description:
      "Summits and forums on governance, entrepreneurship, and networking platforms.",
    image: event3, 
    iconSrc: programIcon3, 
  },
];

/* ---------- Fallback testimonials (6 people, including original) ---------- */
const fallbackTestimonials = [
  {
    quote:
      "When the mobile clinic arrived in our village, it was the first time in years anyone had access to a doctor. My daughter got the care she needed. That day changed our lives forever.",
    name: "Gihozo Anny",
    role: "Student at Essa Nyarugunga RLG Club",
    avatar: heroImg,
  },
  {
    quote:
      "RLG gave me the confidence to speak in front of hundreds of people. I went from being shy to leading my school's debate team. This program truly transforms lives.",
    name: "Mugisha Eric",
    role: "Student Leader, Kigali Secondary School",
    avatar: heroImg,
  },
  {
    quote:
      "The leadership bootcamp opened my eyes to what I could become. I learned that leadership isn't about titles — it's about service and integrity.",
    name: "Uwase Claudine",
    role: "RLG Club Member, Gasabo District",
    avatar: heroImg,
  },
  {
    quote:
      "I joined as a volunteer and ended up finding my life's purpose. Mentoring young people through RLG has been the most rewarding experience of my life.",
    name: "Nkurunziza Patrick",
    role: "Volunteer Mentor, RLG",
    avatar: heroImg,
  },
  {
    quote:
      "The entrepreneurship forum gave me the tools to start my own small business while still in school. I now employ two of my classmates.",
    name: "Ingabire Sandrine",
    role: "Young Entrepreneur & RLG Alumna",
    avatar: heroImg,
  },
  {
    quote:
      "As a teacher, I've watched RLG transform students who were once disengaged into passionate leaders. The impact is visible and lasting.",
    name: "Habimana Jean",
    role: "Teacher & RLG Partner School Coordinator",
    avatar: heroImg,
  },
];

// Array of hero images for the slider
const heroImages = [heroImg, heroBg, heroImage, hero];

export default function Home() {
  const [programs, setPrograms] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  
  // State for the hero image slider
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // State for testimonial slider
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const [p, b, s, t] = await Promise.all([
        api.getPrograms(),
        api.getBlogs(),
        api.getStats(),
        api.getTestimonials(),
      ]);
      setPrograms(p);
      setBlogs(b);
      setStats(s);
      // Use API testimonials if available, otherwise fallback to the 6 local ones
      setTestimonials(t.length > 0 ? t : fallbackTestimonials);
    })();
  }, []);

  // Effect to cycle through hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Effect to cycle through testimonials every 6 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const displayPrograms =
    programs.length > 0
      ? programs.slice(0, 3).map((p, i) => ({
          ...fallbackPrograms[i % fallbackPrograms.length],
          ...p,
        }))
      : fallbackPrograms;

  const currentTestimonial = testimonials[currentTestimonialIndex] || fallbackTestimonials[0];

  const handleVolunteer = () => {
    Swal.fire({
      icon: "info",
      title: "Become A Volunteer",
      text: "Thank you for your interest! We'll be in touch soon.",
      confirmButtonColor: "#2F6B4F",
    });
  };

  const handleWatchVideo = () => {
    Swal.fire({
      icon: "info",
      title: "Watch Our Video",
      text: "Video player coming soon.",
      confirmButtonColor: "#2F6B4F",
    });
  };

  return (
    <>
      <style>{`
        /* ============================================================
           HOME PAGE — matches HTML exactly
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

        .hm-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .hm-page *{ box-sizing:border-box; }
        .hm-page img{ max-width:100%; display:block; }

        .hm-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .hm-section{
          padding:100px 0;
          position:relative;
        }

        .hm-eyebrow{
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
        .hm-eyebrow .dot{
          width:6px; height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        .hm-section-head{
          max-width:640px;
          margin-bottom:56px;
        }
        .hm-section-head.center{
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .hm-section-head h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(32px, 3.5vw, 44px);
          line-height:1.15;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:16px;
        }
        .hm-section-head p{
          font-size:16px;
          color:var(--text-soft);
          line-height:1.7;
        }

        /* ---------- Hero ---------- */
        .hm-hero{
          position:relative;
          min-height:100vh;
          display:flex;
          align-items:center;
          background:var(--navy-deep);
          overflow:hidden;
        }
        .hm-hero-bg{
          position:absolute;
          inset:0;
          background-size:cover;
          background-position:center;
          z-index:0;
          transition: background-image 1s ease-in-out;
        }
        .hm-hero-bg::after{
          content:'';
          position:absolute;
          inset:0;
          background:
            linear-gradient(90deg, rgba(6, 126, 76, 0.75) 0%, hsla(152, 94%, 20%, 0.35) 40%, rgba(4, 101, 66, 0.05) 100%),
            linear-gradient(180deg, rgba(4, 80, 45, 0.1) 0%, rgba(3, 24, 38, 0.6) 100%);
          z-index:1;
        }
        .hm-hero::before{
          content:'';
          position:absolute;
          top:-20%; left:-10%;
          width:60%; height:80%;
          background:radial-gradient(ellipse, hsla(156, 93%, 32%, 0.20), transparent 70%);
          z-index:1;
          pointer-events:none;
        }
        .hm-hero-inner{
          position:relative;
          z-index:2;
          width:100%;
          max-width:1400px;
          margin:0 auto;
          padding:140px 48px 100px;
          display:grid;
          grid-template-columns:1.4fr 0.9fr;
          gap:64px;
          align-items:center;
        }
        .hm-hero-left{ max-width:680px; }
        .hm-hero-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-size:13px;
          font-weight:600;
          letter-spacing:0.06em;
          text-transform:uppercase;
          color:#fff;
          border:1px solid rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.08);
          backdrop-filter:blur(8px);
          padding:8px 16px;
          border-radius:100px;
          margin-bottom:28px;
        }
        .hm-hero-badge .dot{
          width:7px; height:7px;
          border-radius:50%;
          background:var(--gold);
          flex-shrink:0;
        }
        .hm-hero-left h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(40px, 5vw, 68px);
          line-height:1.08;
          color:#fff;
          margin-bottom:24px;
          letter-spacing:-0.02em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .hm-hero-left h1 .accent{ color:var(--green-light); }
        .hm-hero-left .lead{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.95);
          max-width:540px;
          margin-bottom:40px;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
        }
        .hm-hero-actions{
          display:flex;
          align-items:center;
          gap:20px;
          flex-wrap:wrap;
        }

        .hm-btn-gold{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:var(--gold);
          color:var(--navy-deep);
          font-size:15.5px;
          font-weight:700;
          padding:17px 32px;
          border-radius:6px;
          border:none;
          cursor:pointer;
          transition:background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(242,201,76,0.28);
          font-family:'Inter', sans-serif;
        }
        .hm-btn-gold:hover{
          background:var(--gold-hover);
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(242,201,76,0.38);
        }
        .hm-btn-gold svg{ width:18px; height:18px; }

        .hm-btn-video{
          display:inline-flex;
          align-items:center;
          gap:14px;
          background:transparent;
          border:none;
          cursor:pointer;
          color:#fff;
          font-size:15px;
          font-weight:600;
          font-family:'Inter', sans-serif;
          padding:8px 0;
          transition:opacity 0.2s ease;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .hm-btn-video:hover{ opacity:0.85; }
        .hm-play-circle{
          width:52px; height:52px;
          border-radius:50%;
          background:rgba(255,255,255,0.12);
          border:1.5px solid rgba(255,255,255,0.35);
          backdrop-filter:blur(8px);
          display:flex;
          align-items:center;
          justify-content:center;
          transition:background 0.2s ease, transform 0.2s ease;
          flex-shrink:0;
        }
        .hm-btn-video:hover .hm-play-circle{
          background:var(--green);
          border-color:var(--green);
          transform:scale(1.06);
        }
        .hm-play-circle svg{
          width:16px; height:16px;
          fill:#fff;
          margin-left:3px;
        }

        .hm-stats-panel{
          background:linear-gradient(160deg, rgba(47,107,79,0.92) 0%, rgba(15,33,45,0.92) 100%);
          backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:12px;
          padding:40px 36px;
          box-shadow:0 24px 64px rgba(0,0,0,0.35);
        }
        .hm-panel-icon{
          width:56px; height:56px;
          border-radius:50%;
          background:linear-gradient(135deg, var(--gold) 0%, #D4A93A 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:20px;
          box-shadow:0 6px 20px rgba(242,201,76,0.35);
        }
        .hm-panel-icon svg{ width:26px; height:26px; }
        .hm-stats-panel h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:24px;
          font-weight:600;
          color:#fff;
          margin-bottom:10px;
        }
        .hm-panel-desc{
          font-size:14.5px;
          color:rgba(255,255,255,0.72);
          line-height:1.6;
          margin-bottom:28px;
          padding-bottom:28px;
          border-bottom:1px solid rgba(255,255,255,0.12);
        }
        .hm-stats-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:24px;
        }
        .hm-stat-number{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:38px;
          font-weight:700;
          color:#fff;
          line-height:1;
          margin-bottom:8px;
        }
        .hm-stat-number .plus{ color:var(--gold); }
        .hm-stat-label{
          font-size:13.5px;
          color:rgba(255,255,255,0.7);
          line-height:1.45;
        }

        /* ---------- About ---------- */
        .hm-about{ background:var(--paper); }
        .hm-about-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:80px;
          align-items:center;
        }
        .hm-about-images{
          position:relative;
          height:560px;
        }
        .hm-about-img-main{
          position:absolute;
          top:0; left:0;
          width:78%; height:420px;
          border-radius:8px;
          overflow:hidden;
          box-shadow:0 24px 60px rgba(21,43,58,0.18);
        }
        .hm-about-img-main img{
          width:100%; height:100%;
          object-fit:cover;
        }
        .hm-about-img-secondary{
          position:absolute;
          bottom:0; right:0;
          width:60%; height:300px;
          border-radius:8px;
          overflow:hidden;
          border:6px solid var(--paper);
          box-shadow:0 24px 60px rgba(21,43,58,0.22);
        }
        .hm-about-img-secondary img{
          width:100%; height:100%;
          object-fit:cover;
        }
        .hm-about-badge{
          position:absolute;
          top:340px; left:0;
          background:var(--green);
          color:#fff;
          padding:16px 22px;
          border-radius:8px;
          box-shadow:0 12px 32px rgba(47,107,79,0.4);
          z-index:3;
        }
        .hm-about-badge .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:30px;
          font-weight:700;
          line-height:1;
          display:block;
          margin-bottom:4px;
        }
        .hm-about-badge .lbl{
          font-size:12.5px;
          font-weight:600;
          letter-spacing:0.04em;
          opacity:0.9;
          text-transform:uppercase;
        }
        .hm-about-content h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(30px, 3vw, 40px);
          line-height:1.18;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:20px;
        }
        .hm-about-content > p{
          font-size:16px;
          color:var(--text-soft);
          line-height:1.75;
          margin-bottom:32px;
        }
        .hm-about-features{
          list-style:none;
          display:flex;
          flex-direction:column;
          gap:20px;
          margin-bottom:36px;
          padding:0;
        }
        .hm-about-features li{
          display:flex;
          gap:16px;
          align-items:flex-start;
        }
        .hm-about-features .icon{
          width:40px; height:40px;
          border-radius:8px;
          background:rgba(47,107,79,0.1);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }
        .hm-about-features .icon svg{
          width:20px; height:20px;
          stroke:var(--green);
          fill:none;
          stroke-width:1.8;
        }
        .hm-about-features h4{
          font-size:15.5px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:4px;
        }
        .hm-about-features p{
          font-size:14px;
          color:var(--text-soft);
          line-height:1.55;
        }
        .hm-btn-green{
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
        .hm-btn-green:hover{
          background:var(--green-bright);
          transform:translateY(-2px);
        }
        .hm-btn-green svg{ width:16px; height:16px; }

        /* ---------- Programs ---------- */
        .hm-programs{
          background:linear-gradient(180deg, var(--paper) 0%, var(--paper-dim) 100%);
          position:relative;
          overflow:hidden;
        }
        .hm-programs::before{
          content:'';
          position:absolute;
          top:-10%; right:-10%;
          width:50%; height:70%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.25), transparent 70%);
          pointer-events:none;
        }
        .hm-programs-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:28px;
          position:relative;
          z-index:1;
        }
        .hm-program-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:12px;
          overflow:hidden;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          display:flex;
          flex-direction:column;
        }
        .hm-program-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.14);
        }
        .hm-program-img{
          height:220px;
          overflow:hidden;
          position:relative;
        }
        .hm-program-img img{
          width:100%; height:100%;
          object-fit:cover;
          transition:transform 0.5s ease;
        }
        .hm-program-card:hover .hm-program-img img{
          transform:scale(1.06);
        }
        .hm-program-tag{
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
        }
        .hm-program-body{
          padding:28px 26px 30px;
          flex:1;
          display:flex;
          flex-direction:column;
        }
        .hm-program-icon{
          width:48px; height:48px;
          border-radius:10px;
          background:linear-gradient(135deg, rgba(47,107,79,0.12), rgba(63,140,99,0.08));
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:18px;
        }
        .hm-program-icon svg{
          width:24px; height:24px;
          stroke:var(--green);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .hm-program-icon img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .hm-program-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:20px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:10px;
          line-height:1.3;
        }
        .hm-program-card p{
          font-size:14.5px;
          color:var(--text-soft);
          line-height:1.65;
          margin-bottom:22px;
          flex:1;
        }
        .hm-program-link{
          display:inline-flex;
          align-items:center;
          gap:6px;
          font-size:14px;
          font-weight:600;
          color:var(--green);
          text-decoration:none;
          transition:gap 0.2s ease, color 0.2s ease;
        }
        .hm-program-link:hover{
          gap:10px;
          color:var(--green-bright);
        }
        .hm-program-link svg{
          width:14px; height:14px;
        }

        /* ---------- Impact ---------- */
        .hm-impact{
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          color:#fff;
          position:relative;
          overflow:hidden;
        }
        .hm-impact::before{
          content:'';
          position:absolute;
          top:-50%; left:50%;
          transform:translateX(-50%);
          width:100%; height:200%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.15), transparent 60%);
          pointer-events:none;
        }
        .hm-impact .hm-section-head h2{ color:#fff; }
        .hm-impact .hm-section-head p{ color:rgba(255,255,255,0.7); }
        .hm-impact .hm-eyebrow{ color:var(--green-light); }
        .hm-impact-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:32px;
          position:relative;
          z-index:1;
        }
        .hm-impact-item{
          text-align:center;
          padding:32px 16px;
          border-radius:12px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(8px);
          transition:background 0.25s ease, transform 0.25s ease;
        }
        .hm-impact-item:hover{
          background:rgba(255,255,255,0.09);
          transform:translateY(-4px);
        }
        .hm-impact-item .icon{
          width:52px; height:52px;
          border-radius:50%;
          background:rgba(242,201,76,0.15);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 18px;
        }
        .hm-impact-item .icon svg{
          width:24px; height:24px;
          stroke:var(--gold);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .hm-impact-item .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:44px;
          font-weight:700;
          line-height:1;
          color:#fff;
          margin-bottom:10px;
        }
        .hm-impact-item .num .plus{ color:var(--gold); }
        .hm-impact-item .lbl{
          font-size:14px;
          color:rgba(255,255,255,0.7);
          line-height:1.5;
        }

        /* ---------- Story / Testimonials ---------- */
        .hm-story{ background:var(--paper); }
        .hm-story-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:0;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 24px 64px rgba(21,43,58,0.14);
        }
        .hm-story-img{
          min-height:520px;
          background-size:cover;
          background-position:center;
          position:relative;
        }
        .hm-story-img::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(180deg, rgba(15,33,45,0.2) 0%, rgba(35,79,59,0.65) 100%);
        }
        .hm-story-content{
          background:#fff;
          padding:64px 56px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          transition: opacity 0.4s ease;
        }
        .hm-story-content .quote-mark{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:72px;
          line-height:0.6;
          color:var(--green-light);
          margin-bottom:12px;
        }
        .hm-story-content blockquote{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:22px;
          font-weight:500;
          line-height:1.55;
          color:var(--navy);
          font-style:italic;
          margin-bottom:28px;
          min-height:140px;
        }
        .hm-story-author{
          display:flex;
          align-items:center;
          gap:14px;
        }
        .hm-story-author .avatar{
          width:52px; height:52px;
          border-radius:50%;
          overflow:hidden;
          flex-shrink:0;
          border:2px solid var(--green-light);
        }
        .hm-story-author .avatar img{
          width:100%; height:100%;
          object-fit:cover;
        }
        .hm-story-author .name{
          font-size:15px;
          font-weight:700;
          color:var(--navy);
        }
        .hm-story-author .role{
          font-size:13.5px;
          color:var(--text-soft);
        }

        /* Testimonial dots */
        .hm-story-dots{
          display:flex;
          justify-content:center;
          gap:10px;
          margin-top:32px;
        }
        .hm-story-dots button{
          width:10px; height:10px;
          border-radius:50%;
          border:none;
          background:var(--line);
          cursor:pointer;
          padding:0;
          transition:background 0.2s ease, transform 0.2s ease;
        }
        .hm-story-dots button.active{
          background:var(--green);
          transform:scale(1.2);
        }
        .hm-story-dots button:hover{
          background:var(--green-bright);
        }

        /* ---------- CTA ---------- */
        .hm-cta{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          position:relative;
          overflow:hidden;
          padding:80px 0;
        }
        .hm-cta::before{
          content:'';
          position:absolute;
          top:-60%; right:-10%;
          width:60%; height:220%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.15), transparent 65%);
          pointer-events:none;
        }
        .hm-cta-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:720px;
          margin:0 auto;
        }
        .hm-cta h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(30px, 3.5vw, 42px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:18px;
        }
        .hm-cta p{
          font-size:16.5px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
          margin-bottom:36px;
        }
        .hm-cta-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:16px;
          flex-wrap:wrap;
        }
        .hm-btn-white{
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
        .hm-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }
        .hm-btn-outline-white{
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
        .hm-btn-outline-white:hover{
          background:rgba(255,255,255,0.1);
          border-color:rgba(255,255,255,0.7);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .hm-container{ padding:0 32px; }
          .hm-hero-inner{
            grid-template-columns:1fr;
            gap:48px;
            padding:120px 32px 80px;
          }
          .hm-stats-panel{ max-width:520px; }
          .hm-about-grid{ grid-template-columns:1fr; gap:56px; }
          .hm-about-images{ height:480px; }
          .hm-programs-grid{ grid-template-columns:repeat(2, 1fr); }
          .hm-impact-grid{ grid-template-columns:repeat(2, 1fr); }
          .hm-story-grid{ grid-template-columns:1fr; }
          .hm-story-img{ min-height:320px; }
        }
        @media (max-width: 640px){
          .hm-container{ padding:0 22px; }
          .hm-section{ padding:72px 0; }
          .hm-hero-inner{ padding:110px 22px 70px; }
          .hm-hero-actions{ flex-direction:column; align-items:flex-start; gap:16px; }
          .hm-btn-gold{ width:100%; justify-content:center; }
          .hm-stats-panel{ padding:30px 24px; }
          .hm-stats-grid{ gap:20px; }
          .hm-stat-number{ font-size:32px; }
          .hm-about-images{ height:400px; }
          .hm-about-img-main{ height:320px; }
          .hm-about-img-secondary{ height:220px; }
          .hm-about-badge{ top:260px; }
          .hm-programs-grid{ grid-template-columns:1fr; }
          .hm-impact-grid{ grid-template-columns:1fr 1fr; gap:16px; }
          .hm-impact-item{ padding:24px 12px; }
          .hm-impact-item .num{ font-size:34px; }
          .hm-story-content{ padding:40px 28px; }
          .hm-story-content blockquote{ font-size:18px; min-height:auto; }
          .hm-cta-actions{ flex-direction:column; }
          .hm-btn-white, .hm-btn-outline-white{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .hm-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="hm-page">

        {/* ============ HERO ============ */}
        <section className="hm-hero" id="home">
          <div 
            className="hm-hero-bg" 
            style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
          ></div>

          <div className="hm-hero-inner">
            <div className="hm-hero-left">
              <div className="hm-hero-badge">
                <span className="dot"></span>
                BRIGHT FUTURE STARTS NOW
              </div>

              <h1>
                Lead and Empower<br />
                for  <span className="accent">Change</span>
              </h1>

              <p className="lead">
                Raising Leaders of Generation (RLG) nurtures visionary, action-driven young
                people through social impact, mental transformation, and moral integrity.
              </p>

              <div className="hm-hero-actions">
                <button className="hm-btn-gold" onClick={handleVolunteer}>
                  Become A Volunteer
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </button>

                <button className="hm-btn-video" onClick={handleWatchVideo}>
                  <span className="hm-play-circle">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  Watch Our Video
                </button>
              </div>
            </div>

           <aside className="hm-stats-panel">
  <div className="hm-panel-icon">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#152B3A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
      <circle cx="18" cy="8" r="2" opacity="0.5" />
      <circle cx="6" cy="8" r="2" opacity="0.5" />
    </svg>
  </div>

  <h3>Leadership Note</h3>
  <p className="hm-panel-desc">
    Guided by a clear vision and unwavering commitment, our leadership inspires collective action and lasting change.
  </p>

  <div className="hm-stats-grid">
    <div className="stat-item">
      <div className="hm-stat-number">
        15<span className="plus">+</span>
      </div>
      <div className="hm-stat-label">Years of Dedicated Leadership</div>
    </div>
    <div className="stat-item">
      <div className="hm-stat-number">
        50<span className="plus">+</span>
      </div>
      <div className="hm-stat-label">Strategic Initiatives Led</div>
    </div>
  </div>
</aside>
          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <section className="hm-section hm-about" id="about">
          <div className="hm-container">
            <div className="hm-about-grid">

              <div className="hm-about-images">
                <div className="hm-about-img-main">
                   <img
  src={volimg}
  alt="Community outreach"
/>
                
                </div>
                <div className="hm-about-img-secondary">
                 <img
  src={aboutImage}
  alt="Community outreach"
/>
                </div>
                <div className="hm-about-badge">
                  <span className="num">2+</span>
                  <span className="lbl">Years of Service</span>
                </div>
              </div>

              <div className="hm-about-content">
                <span className="hm-eyebrow"><span className="dot"></span> About Us</span>
               <h2>Guided by vision, driven by integrity.</h2>
<p>
  Our leadership is built on a simple belief: real change starts with
  accountable, compassionate people. We bring together experienced
  mentors and emerging voices who lead with humility, listen first,
  and stay committed for the long haul.
</p>

<ul className="hm-about-features">
  <li>
    <span className="icon">
      <svg viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <div>
      <h4>Purpose-Led Direction</h4>
      <p>Every decision starts with the communities we serve, not the other way around.</p>
    </div>
  </li>
  <li>
    <span className="icon">
      <svg viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <div>
      <h4>Accountable Leadership</h4>
      <p>Open reporting, clear goals, and 89 cents of every dollar going directly to programs.</p>
    </div>
  </li>
  <li>
    <span className="icon">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <div>
      <h4>Enduring Commitment</h4>
      <p>We mentor the next generation of leaders and stay until change takes root.</p>
    </div>
  </li>
</ul>

                <Link to="/about" className="hm-btn-green">
                  Learn More About Us
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
              </div>

            </div>
          </div>
        </section>

        {/* ============ PROGRAMS ============ */}
        <section className="hm-section hm-programs" id="programs">
          <div className="hm-container">
            <div className="hm-section-head center">
              <span className="hm-eyebrow"><span className="dot"></span> Our Programs</span>
              <h2>What we do, and how we do it</h2>
              <p>Three core pillars guide every initiative we launch and every community we serve.</p>
            </div>

            <div className="hm-programs-grid">
              {displayPrograms.map((p, i) => (
                <article key={i} className="hm-program-card">
                  <div className="hm-program-img">
                    <img src={p.image} alt={p.title} />
                    <span className="hm-program-tag">{p.tag || p.category}</span>
                  </div>
                  <div className="hm-program-body">
                    <div className="hm-program-icon">
                      {p.iconSrc ? (
                        <img src={p.iconSrc} alt="icon" />
                      ) : (
                        <svg viewBox="0 0 24 24">
                          <path d={p.iconPath || fallbackPrograms[i % 3].iconPath} />
                        </svg>
                      )}
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description || p.longDescription}</p>
                    <Link to="/programs" className="hm-program-link">
                      Explore Program
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
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ IMPACT ============ */}
        <section className="hm-section hm-impact" id="impact">
          <div className="hm-container">
            <div className="hm-section-head center">
              <span className="hm-eyebrow"><span className="dot"></span> Our Impact</span>
              <h2>Numbers that tell a story</h2>
              <p>Every figure represents a life touched, a community strengthened, a future rewritten.</p>
            </div>

            <div className="hm-impact-grid">
              <div className="hm-impact-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <div className="num">
                  50<span className="plus">+</span>
                </div>
                <div className="lbl">Lives Positively Impacted</div>
              </div>

              <div className="hm-impact-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div className="num">
                  50<span className="plus">+</span>
                </div>
                <div className="lbl">Active Volunteers</div>
              </div>

              <div className="hm-impact-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <div className="num">
                  10<span className="plus">+</span>
                </div>
                <div className="lbl">Projects Completed</div>
              </div>

              <div className="hm-impact-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div className="num">
                  10<span className="plus">+</span>
                </div>
                <div className="lbl">Countries Reached</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ STORY / TESTIMONIAL (Now with 6 rotating testimonials) ============ */}
        <section className="hm-section hm-story" id="stories">
          <div className="hm-container">
            <div className="hm-section-head center">
              <span className="hm-eyebrow"><span className="dot"></span> Stories of Change</span>
              <h2>Real people. Real impact.</h2>
            </div>

            <div className="hm-story-grid">
              {/* Left side image (event1) — stays the same */}
              <div 
                className="hm-story-img"
                style={{ backgroundImage: `url(${event1})` }}
              ></div>

              {/* Right side content — now rotates through 6 testimonials */}
              <div className="hm-story-content">
                <div className="quote-mark">&ldquo;</div>
                <blockquote>
                  {currentTestimonial.quote}
                </blockquote>
                <div className="hm-story-author">
                  <div className="avatar">
                    <img
                      src={currentTestimonial.avatar || heroImg}
                      alt={currentTestimonial.name}
                    />
                  </div>
                  <div>
                    <div className="name">{currentTestimonial.name}</div>
                    <div className="role">{currentTestimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots for testimonial navigation */}
            {testimonials.length > 1 && (
              <div className="hm-story-dots">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={idx === currentTestimonialIndex ? "active" : ""}
                    onClick={() => setCurrentTestimonialIndex(idx)}
                    aria-label={`View testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="hm-cta" id="cta">
          <div className="hm-container">
            <div className="hm-cta-inner">
              <h2>Ready to make a difference?</h2>
              <p>
                Whether you give your time, your resources, or your voice — every action
                moves us closer to a world where compassion wins.
              </p>
              <div className="hm-cta-actions">
                <Link to="/getinvolved" className="hm-btn-white">
                  Join Our Mission
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
                <Link to="/contact" className="hm-btn-outline-white">
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}