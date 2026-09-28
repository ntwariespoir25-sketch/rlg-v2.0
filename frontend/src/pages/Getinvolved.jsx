import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import aboutImage from '../assets/mem.jpeg';


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- Interest options ---------- */
const interests = [
  {
    value: "Start/Join an RLG Club",
    label: "Start / Join an RLG Club",
    desc: "Bring leadership programs to your school.",
    iconPath:
      "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  },
  {
    value: "Become a Mentor",
    label: "Become a Mentor",
    desc: "Guide young leaders with your experience.",
    iconPath:
      "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87",
  },
  {
    value: "Volunteer at Events",
    label: "Volunteer at Events",
    desc: "Help organize debates, forums and bootcamps.",
    iconPath:
      "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  },
  {
    value: "Partner My Organization",
    label: "Partner My Organization",
    desc: "Collaborate with us on shared goals.",
    iconPath:
      "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z",
  },
];

/* ---------- Hero stats ---------- */
const heroStats = [
  { num: "1,200", plus: "+", label: "Active Volunteers" },
  { num: "120", plus: "+", label: "Partner Schools" },
  { num: "4", plus: "", label: "Ways to Join" },
];

/* ---------- Process steps ---------- */
const processSteps = [
  {
    num: "01",
    title: "We review your application",
    desc: "Our team carefully reviews every submission within 2–3 business days to match you with the right opportunity.",
  },
  {
    num: "02",
    title: "A coordinator reaches out",
    desc: "A community coordinator contacts you by phone or email to discuss next steps and answer your questions.",
  },
  {
    num: "03",
    title: "You receive your welcome pack",
    desc: "You'll get onboarding materials, and if relevant, a formal introduction to your school or club.",
  },
];

export default function Getinvolved() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    interest: "",
    district: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectInterest = (value) => {
    // Toggle: if clicking the same one, deselect
    if (form.interest === value) {
      setForm({ ...form, interest: "" });
    } else {
      setForm({ ...form, interest: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.interest) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in your name, email, and an area of interest.",
        confirmButtonColor: "#2f6b4f",
      });
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch(`${API_URL}/getinvolved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Submission failed");

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Thank you! A coordinator will contact you soon.",
        confirmButtonColor: "#2f6b4f",
        timer: 3500,
        timerProgressBar: true,
      });
      setForm({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        interest: "",
        district: "",
        message: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#2f6b4f",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* ============================================================
           GET INVOLVED PAGE — matches HTML exactly
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

        .gi-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .gi-page *{ box-sizing:border-box; }
        .gi-page img{ max-width:100%; display:block; }

        .gi-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .gi-section{
          padding:100px 0;
          position:relative;
        }
        .gi-section-gray{
          background:linear-gradient(180deg, var(--paper) 0%, var(--paper-dim) 100%);
        }

        .gi-eyebrow{
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
        .gi-eyebrow .dot{
          width:6px; height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .gi-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
          text-align:center;
        }
        .gi-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.25), transparent 65%);
          pointer-events:none;
        }
        .gi-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .gi-hero-inner{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .gi-hero .gi-eyebrow{
          color:var(--green-light);
          justify-content:center;
        }
        .gi-hero h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 60px);
          line-height:1.1;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .gi-hero h1 .accent{ color:var(--gold); }
        .gi-hero p{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.82);
          max-width:620px;
          margin:0 auto 32px;
        }

        .gi-hero-stats{
          display:flex;
          justify-content:center;
          gap:48px;
          flex-wrap:wrap;
          margin-top:40px;
          padding-top:36px;
          border-top:1px solid rgba(255,255,255,0.12);
        }
        .gi-hero-stat .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:32px;
          font-weight:700;
          color:#fff;
          line-height:1;
          margin-bottom:6px;
        }
        .gi-hero-stat .num .plus{ color:var(--gold); }
        .gi-hero-stat .lbl{
          font-size:13px;
          color:rgba(255,255,255,0.65);
          letter-spacing:0.02em;
        }

        /* ---------- Section head ---------- */
        .gi-section-head{
          max-width:640px;
          margin-bottom:48px;
        }
        .gi-section-head.center{
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .gi-section-head h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 38px);
          line-height:1.18;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:14px;
        }
        .gi-section-head p{
          font-size:15.5px;
          color:var(--text-soft);
          line-height:1.7;
        }

        /* ---------- Main grid ---------- */
        .gi-involved-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:64px;
          align-items:start;
        }

        .gi-involved-left .gi-eyebrow{ color:var(--green); }
        .gi-involved-left h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(26px, 2.8vw, 34px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:16px;
        }
        .gi-involved-left > p{
          font-size:15.5px;
          color:var(--text-soft);
          line-height:1.7;
          margin-bottom:32px;
        }

        /* ---------- Interest cards ---------- */
        .gi-interest-list{
          display:grid;
          gap:14px;
          margin-bottom:40px;
        }
        .gi-interest-card{
          display:flex;
          align-items:center;
          gap:18px;
          text-align:left;
          width:100%;
          padding:20px 22px;
          border-radius:14px;
          border:1.5px solid var(--line);
          background:#fff;
          cursor:pointer;
          transition:all 0.25s ease;
          font-family:'Inter', sans-serif;
          position:relative;
          overflow:hidden;
        }
        .gi-interest-card::before{
          content:'';
          position:absolute;
          left:0; top:0; bottom:0;
          width:4px;
          background:var(--green);
          transform:scaleY(0);
          transform-origin:top;
          transition:transform 0.25s ease;
        }
        .gi-interest-card:hover{
          border-color:var(--green-light);
          transform:translateX(4px);
          box-shadow:0 8px 24px rgba(21,43,58,0.08);
        }
        .gi-interest-card.active{
          border-color:var(--green);
          background:linear-gradient(135deg, rgba(47,107,79,0.06), rgba(143,193,163,0.08));
          box-shadow:0 8px 24px rgba(47,107,79,0.15);
        }
        .gi-interest-card.active::before{
          transform:scaleY(1);
        }

        .gi-interest-icon{
          width:52px; height:52px;
          border-radius:12px;
          flex-shrink:0;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 6px 16px rgba(47,107,79,0.25);
          transition:transform 0.25s ease;
        }
        .gi-interest-card:hover .gi-interest-icon{
          transform:scale(1.06);
        }
        .gi-interest-icon svg{
          width:24px; height:24px;
          stroke:#fff;
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .gi-interest-content{ flex:1; }
        .gi-interest-content b{
          display:block;
          font-size:15px;
          font-weight:700;
          color:var(--navy);
          margin-bottom:4px;
          line-height:1.35;
        }
        .gi-interest-content span{
          font-size:13.5px;
          color:var(--text-soft);
          line-height:1.5;
        }

        .gi-interest-check{
          width:24px; height:24px;
          border-radius:50%;
          border:2px solid var(--line);
          flex-shrink:0;
          display:flex;
          align-items:center;
          justify-content:center;
          transition:all 0.2s ease;
        }
        .gi-interest-card.active .gi-interest-check{
          background:var(--green);
          border-color:var(--green);
        }
        .gi-interest-check svg{
          width:12px; height:12px;
          stroke:#fff;
          fill:none;
          stroke-width:3;
          stroke-linecap:round;
          stroke-linejoin:round;
          opacity:0;
          transition:opacity 0.2s ease;
        }
        .gi-interest-card.active .gi-interest-check svg{
          opacity:1;
        }

        /* Image block */
        .gi-involved-image{
          position:relative;
          border-radius:16px;
          overflow:hidden;
          height:320px;
          box-shadow:0 20px 48px rgba(21,43,58,0.14);
        }
        .gi-involved-image img{
          width:100%; height:100%;
          object-fit:cover;
        }
        .gi-involved-image::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(180deg, rgba(15,33,45,0) 40%, rgba(15,33,45,0.8) 100%);
        }
        .gi-involved-caption{
          position:absolute;
          bottom:22px; left:24px; right:24px;
          z-index:2;
          color:#fff;
        }
        .gi-involved-caption .title{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:20px;
          font-weight:600;
          margin-bottom:4px;
        }
        .gi-involved-caption .desc{
          font-size:13.5px;
          color:rgba(255,255,255,0.82);
        }

        /* ---------- Form card ---------- */
        .gi-form-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:18px;
          padding:44px 40px;
          box-shadow:0 24px 64px rgba(21,43,58,0.1);
          position:sticky;
          top:32px;
          overflow:hidden;
        }
        .gi-form-card::before{
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:4px;
          background:linear-gradient(90deg, var(--green), var(--green-light), var(--gold));
        }
        .gi-form-header{ margin-bottom:28px; }
        .gi-form-header h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:24px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:8px;
        }
        .gi-form-header p{
          font-size:14px;
          color:var(--text-soft);
          line-height:1.6;
        }

        .gi-form-row{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
        }
        .gi-form-field{ margin-bottom:18px; }
        .gi-form-field label{
          display:block;
          font-size:13px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:8px;
        }
        .gi-form-field label .required{
          color:var(--green);
          margin-left:2px;
        }
        .gi-form-field input,
        .gi-form-field select,
        .gi-form-field textarea{
          width:100%;
          padding:13px 16px;
          border:1.5px solid var(--line);
          border-radius:10px;
          font-size:14.5px;
          font-family:'Inter', sans-serif;
          color:var(--text);
          background:var(--paper);
          outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .gi-form-field textarea{
          min-height:110px;
          resize:vertical;
          line-height:1.6;
        }
        .gi-form-field select{
          appearance:none;
          -webkit-appearance:none;
          -moz-appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7178' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat:no-repeat;
          background-position:right 14px center;
          background-size:16px;
          padding-right:44px;
          cursor:pointer;
        }
        .gi-form-field input:focus,
        .gi-form-field select:focus,
        .gi-form-field textarea:focus{
          border-color:var(--green);
          background:#fff;
          box-shadow:0 0 0 4px rgba(47,107,79,0.1);
        }
        .gi-form-field input::placeholder,
        .gi-form-field textarea::placeholder{
          color:#9AA0A6;
        }

        .gi-selected-badge{
          display:flex;
          align-items:center;
          gap:8px;
          background:rgba(47,107,79,0.08);
          border:1px solid var(--green-light);
          border-radius:8px;
          padding:10px 14px;
          margin-bottom:18px;
          font-size:13px;
          color:var(--green-deep);
          font-weight:600;
        }
        .gi-selected-badge svg{
          width:14px; height:14px;
          stroke:var(--green);
          fill:none;
          stroke-width:2.4;
          stroke-linecap:round;
          stroke-linejoin:round;
          flex-shrink:0;
        }
        .gi-selected-badge .label{
          color:var(--text-soft);
          font-weight:500;
        }

        .gi-submit-btn{
          width:100%;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          color:#fff;
          font-size:15.5px;
          font-weight:700;
          font-family:'Inter', sans-serif;
          padding:17px 32px;
          border-radius:10px;
          border:none;
          cursor:pointer;
          transition:transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(47,107,79,0.32);
          margin-top:6px;
        }
        .gi-submit-btn:hover:not(:disabled){
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(47,107,79,0.4);
        }
        .gi-submit-btn:active:not(:disabled){ transform:translateY(0); }
        .gi-submit-btn:disabled{ opacity:0.7; cursor:not-allowed; }
        .gi-submit-btn svg{
          width:17px; height:17px;
          stroke:currentColor;
          fill:none;
          stroke-width:2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .gi-form-footnote{
          font-size:12px;
          color:var(--text-soft);
          text-align:center;
          margin-top:14px;
          line-height:1.6;
        }

        /* ---------- Process grid ---------- */
        .gi-process-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:28px;
        }
        .gi-process-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:36px 30px;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position:relative;
          overflow:hidden;
        }
        .gi-process-card::before{
          content:'';
          position:absolute;
          top:0; left:0;
          width:100%; height:3px;
          background:linear-gradient(90deg, var(--green), var(--green-light));
          opacity:0;
          transition:opacity 0.25s ease;
        }
        .gi-process-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.12);
          border-color:var(--green-light);
        }
        .gi-process-card:hover::before{ opacity:1; }
        .gi-process-num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:44px;
          font-weight:700;
          line-height:1;
          color:var(--green-light);
          margin-bottom:18px;
          display:block;
        }
        .gi-process-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:19px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:10px;
          line-height:1.35;
        }
        .gi-process-card p{
          font-size:14px;
          color:var(--text-soft);
          line-height:1.7;
        }

        /* ---------- CTA grid ---------- */
        .gi-cta-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:28px;
        }
        .gi-cta-card{
          border-radius:18px;
          padding:48px 40px;
          position:relative;
          overflow:hidden;
          display:flex;
          flex-direction:column;
        }
        .gi-cta-donate{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          color:#fff;
        }
        .gi-cta-donate::before{
          content:'';
          position:absolute;
          top:-60%; right:-20%;
          width:80%; height:220%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.2), transparent 65%);
          pointer-events:none;
        }
        .gi-cta-contact{
          background:#fff;
          border:1px solid var(--line);
          border-left:4px solid var(--green);
        }
        .gi-cta-icon{
          width:56px; height:56px;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:22px;
          position:relative;
          z-index:1;
        }
        .gi-cta-donate .gi-cta-icon{
          background:rgba(255,255,255,0.15);
          border:1px solid rgba(255,255,255,0.25);
          backdrop-filter:blur(8px);
        }
        .gi-cta-contact .gi-cta-icon{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          box-shadow:0 8px 22px rgba(47,107,79,0.3);
        }
        .gi-cta-icon svg{
          width:26px; height:26px;
          stroke:#fff;
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .gi-cta-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:24px;
          font-weight:600;
          margin-bottom:12px;
          line-height:1.25;
          position:relative;
          z-index:1;
        }
        .gi-cta-donate h3{ color:#fff; }
        .gi-cta-contact h3{ color:var(--navy); }
        .gi-cta-card p{
          font-size:15px;
          line-height:1.7;
          margin-bottom:28px;
          position:relative;
          z-index:1;
          flex:1;
        }
        .gi-cta-donate p{ color:rgba(255,255,255,0.85); }
        .gi-cta-contact p{ color:var(--text-soft); }
        .gi-cta-actions{
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          position:relative;
          z-index:1;
        }

        .gi-btn-white{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:#fff;
          color:var(--green-deep);
          font-size:15px;
          font-weight:700;
          padding:15px 28px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          text-decoration:none;
          transition:transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(0,0,0,0.15);
          font-family:'Inter', sans-serif;
        }
        .gi-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }
        .gi-btn-white svg{
          width:16px; height:16px;
          stroke:currentColor;
          fill:none;
          stroke-width:2.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        .gi-btn-primary{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          color:#fff;
          font-size:15px;
          font-weight:700;
          padding:15px 28px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          text-decoration:none;
          transition:transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(47,107,79,0.3);
          font-family:'Inter', sans-serif;
        }
        .gi-btn-primary:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(47,107,79,0.4);
        }
        .gi-btn-primary svg{
          width:16px; height:16px;
          stroke:currentColor;
          fill:none;
          stroke-width:2.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .gi-container{ padding:0 32px; }
          .gi-hero{ padding:110px 0 80px; }
          .gi-involved-grid{ grid-template-columns:1fr; gap:48px; }
          .gi-form-card{ position:static; }
          .gi-process-grid{ grid-template-columns:1fr; max-width:520px; margin:0 auto; }
          .gi-cta-grid{ grid-template-columns:1fr; }
        }
        @media (max-width: 640px){
          .gi-container{ padding:0 22px; }
          .gi-section{ padding:72px 0; }
          .gi-hero{ padding:90px 0 70px; }
          .gi-hero-stats{ gap:32px; }
          .gi-form-card{ padding:32px 24px; }
          .gi-form-row{ grid-template-columns:1fr; gap:0; }
          .gi-cta-card{ padding:36px 26px; }
          .gi-cta-actions{ flex-direction:column; }
          .gi-btn-white, .gi-btn-primary{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .gi-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="gi-page">

        {/* ============ PAGE HERO ============ */}
        <section className="gi-hero">
          <div className="gi-hero-inner">
            <span className="gi-eyebrow"><span className="dot"></span> Join the Movement</span>
            <h1>Get <span className="accent">Involved</span></h1>
            <p>
              Start a club, mentor a student, volunteer at events, or partner with us —
              there's a place for everyone in this movement.
            </p>

            <div className="gi-hero-stats">
              {heroStats.map((s, i) => (
                <div key={i} className="gi-hero-stat">
                  <div className="num">
                    {s.num}
                    {s.plus && <span className="plus">{s.plus}</span>}
                  </div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ MAIN INVOLVED SECTION ============ */}
        <section className="gi-section">
          <div className="gi-container">
            <div className="gi-involved-grid">

              {/* LEFT — interest cards + image */}
              <div className="gi-involved-left">
                <span className="gi-eyebrow"><span className="dot"></span> Ways to Join</span>
                <h2>Choose how you want to make an impact.</h2>
                <p>
                  Pick the path that fits your skills and passion. Each option opens
                  a different door — but they all lead to the same place: transforming
                  young lives across Rwanda.
                </p>

                <div className="gi-interest-list">
                  {interests.map((it) => (
                    <button
                      key={it.value}
                      type="button"
                      className={`gi-interest-card ${
                        form.interest === it.value ? "active" : ""
                      }`}
                      onClick={() => selectInterest(it.value)}
                    >
                      <div className="gi-interest-icon">
                        <svg viewBox="0 0 24 24">
                          <path d={it.iconPath} />
                        </svg>
                      </div>
                      <div className="gi-interest-content">
                        <b>{it.label}</b>
                        <span>{it.desc}</span>
                      </div>
                      <div className="gi-interest-check">
                        <svg viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="gi-involved-image">
                     <img
                   src={aboutImage}
                   alt="Community outreach"
                 />
                  <div className="gi-involved-caption">
                    <div className="title">RLG Club Members in Action</div>
                    <div className="desc">
                      Students leading change in their schools and communities.
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — application form */}
              <div className="gi-form-card">
                <div className="gi-form-header">
                  <h3>Application Form</h3>
                  <p>
                    Fill in your details and we'll get back to you within 2–3 business days.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {form.interest && (
                    <div className="gi-selected-badge">
                      <svg viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>
                        <span className="label">Interest:</span> {form.interest}
                      </span>
                    </div>
                  )}

                  <div className="gi-form-field">
                    <label htmlFor="fullName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="gi-form-row">
                    <div className="gi-form-field">
                      <label htmlFor="email">
                        Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="gi-form-field">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+250..."
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="gi-form-row">
                    <div className="gi-form-field">
                      <label htmlFor="organization">Organization / School</label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        placeholder="Optional"
                        value={form.organization}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="gi-form-field">
                      <label htmlFor="district">District</label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        placeholder="Your district"
                        value={form.district}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="gi-form-field">
                    <label htmlFor="interest">
                      Area of Interest <span className="required">*</span>
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select an option</option>
                      {interests.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="gi-form-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tell us a bit about yourself..."
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="gi-submit-btn"
                    disabled={submitting}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    <span>
                      {submitting ? "Submitting..." : "Submit Application"}
                    </span>
                  </button>

                  <p className="gi-form-footnote">
                    We respect your privacy. Your information is only used to respond to
                    your inquiry.
                  </p>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="gi-section gi-section-gray">
          <div className="gi-container">
            <div className="gi-section-head center">
              <span className="gi-eyebrow"><span className="dot"></span> What Happens Next</span>
              <h2>Your journey from application to impact</h2>
              <p>A simple, transparent process designed to get you involved quickly.</p>
            </div>

            <div className="gi-process-grid">
              {processSteps.map((p, i) => (
                <div key={i} className="gi-process-card">
                  <span className="gi-process-num">{p.num}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA GRID ============ */}
        <section className="gi-section">
          <div className="gi-container">
            <div className="gi-cta-grid">

              <div className="gi-cta-card gi-cta-donate">
                <div className="gi-cta-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <h3>Prefer to donate instead?</h3>
                <p>
                  Your support funds clubs, debates, and bootcamps that transform
                  young lives. Every dollar makes a difference.
                </p>
                <div className="gi-cta-actions">
                  <Link to="/donate" className="gi-btn-white">
                    Donate Now
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="gi-cta-card gi-cta-contact">
                <div className="gi-cta-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <h3>Have a question first?</h3>
                <p>
                  Not sure which path is right for you? Reach out to our team —
                  we're happy to help you find the best way to get involved.
                </p>
                <div className="gi-cta-actions">
                  <Link to="/contact" className="gi-btn-primary">
                    Contact Us
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}