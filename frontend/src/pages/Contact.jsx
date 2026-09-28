import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const subjects = [
  "Programs inquiry",
  "Partnership request",
  "Volunteering",
  "Donation",
  "General question",
];

const faqs = [
  {
    q: "How can my school start an RLG Club?",
    a: "Email us or call, and we will send a Community Coordinator to meet your school administration.",
  },
  {
    q: "Are your events free?",
    a: "Most events are free for students. Some conferences may require registration. We never turn away a student for lack of funds.",
  },
  {
    q: "Can I donate online?",
    a: "Yes — visit our Donate page to give via mobile money, bank transfer, or credit card.",
  },
  {
    q: "How do I become a partner?",
    a: "Fill out the contact form or Get Involved page, and we will send you a partnership proposal.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in your name, email, subject, and message.",
        confirmButtonColor: "#2f6b4f",
      });
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed to send message");

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: `Thank you ${form.name}! We'll respond within 2–3 business days.`,
        confirmButtonColor: "#2f6b4f",
        timer: 3500,
        timerProgressBar: true,
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
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
           CONTACT PAGE — matches HTML exactly
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

        .ct-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .ct-page *{ box-sizing:border-box; }
        .ct-page img{ max-width:100%; display:block; }

        .ct-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .ct-section{
          padding:100px 0;
          position:relative;
        }
        .ct-section-gray{
          background:linear-gradient(180deg, var(--paper) 0%, var(--paper-dim) 100%);
        }

        .ct-eyebrow{
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
        .ct-eyebrow .dot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .ct-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
          text-align:center;
        }
        .ct-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.22), transparent 65%);
          pointer-events:none;
        }
        .ct-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .ct-hero-inner{
          position:relative;
          z-index:1;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .ct-hero .ct-eyebrow{
          color:var(--green-light);
          justify-content:center;
        }
        .ct-hero h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 60px);
          line-height:1.1;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .ct-hero h1 .accent{ color:var(--gold); }
        .ct-hero p{
          font-size:clamp(16px, 1.3vw, 19px);
          line-height:1.65;
          color:rgba(255,255,255,0.82);
          max-width:620px;
          margin:0 auto;
        }

        /* ---------- Section heads ---------- */
        .ct-section-head{
          max-width:640px;
          margin-bottom:48px;
        }
        .ct-section-head.center{
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .ct-section-head h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 38px);
          line-height:1.18;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:12px;
        }
        .ct-section-head p{
          font-size:15.5px;
          color:var(--text-soft);
          line-height:1.7;
        }

        /* ---------- Contact Info Cards ---------- */
        .ct-contact-grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:28px;
        }
        .ct-contact-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:14px;
          padding:40px 32px;
          text-align:center;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ct-contact-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.12);
          border-color:var(--green-light);
        }
        .ct-contact-icon{
          width:60px; height:60px;
          border-radius:14px;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 20px;
          box-shadow:0 8px 22px rgba(47,107,79,0.3);
        }
        .ct-contact-icon svg{
          width:26px; height:26px;
          stroke:#fff; fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .ct-contact-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:19px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:14px;
        }
        .ct-contact-card p{
          font-size:14.5px;
          color:var(--text-soft);
          line-height:1.6;
          margin-bottom:4px;
        }
        .ct-contact-card p:last-child{ margin-bottom:0; }

        /* ---------- Social Media ---------- */
        .ct-social-grid{
          display:flex;
          justify-content:center;
          flex-wrap:wrap;
          gap:24px;
        }
        .ct-social-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:14px;
          padding:32px 28px;
          text-align:center;
          min-width:200px;
          text-decoration:none;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          display:block;
        }
        .ct-social-card:hover{
          transform:translateY(-6px);
          box-shadow:0 20px 44px rgba(21,43,58,0.12);
          border-color:var(--green-light);
        }
        .ct-social-icon{
          width:56px; height:56px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 16px;
          box-shadow:0 6px 18px rgba(0,0,0,0.15);
        }
        .ct-social-icon svg{
          width:24px; height:24px;
          fill:#fff;
        }
        .ct-social-icon.facebook{ background:linear-gradient(135deg, #1877f2, #0d5cc4); }
        .ct-social-icon.twitter{ background:linear-gradient(135deg, #1da1f2, #0d8ddb); }
        .ct-social-icon.instagram{ background:linear-gradient(135deg, #e4405f, #c92d4b); }

        .ct-social-card h4{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:17px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:6px;
        }
        .ct-social-card p{
          font-size:13px;
          color:var(--text-soft);
        }

        /* ---------- Form ---------- */
        .ct-form-wrapper{
          max-width:780px;
          margin:0 auto;
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:48px 44px;
          box-shadow:0 20px 50px rgba(21,43,58,0.08);
          position:relative;
          overflow:hidden;
        }
        .ct-form-wrapper::before{
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:4px;
          background:linear-gradient(90deg, var(--green), var(--green-light), var(--gold));
        }
        .ct-form-row{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
          margin-bottom:22px;
        }
        .ct-field{ margin-bottom:22px; }
        .ct-field label{
          display:block;
          font-size:13px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:8px;
        }
        .ct-field input,
        .ct-field textarea{
          width:100%;
          padding:14px 16px;
          border:1.5px solid var(--line);
          border-radius:8px;
          font-size:14.5px;
          font-family:'Inter', sans-serif;
          color:var(--text);
          background:var(--paper);
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          outline:none;
        }
        .ct-field textarea{
          min-height:140px;
          resize:vertical;
          line-height:1.6;
        }
        .ct-field input:focus,
        .ct-field textarea:focus{
          border-color:var(--green);
          background:#fff;
          box-shadow:0 0 0 4px rgba(47,107,79,0.1);
        }
        .ct-field input::placeholder,
        .ct-field textarea::placeholder{
          color:#9AA0A6;
        }

        /* Subject chips */
        .ct-subject-chips{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin-top:4px;
        }
        .ct-subject-chip{
          padding:10px 18px;
          border-radius:100px;
          border:1.5px solid var(--line);
          background:#fff;
          color:var(--text);
          font-size:13px;
          font-weight:600;
          font-family:'Inter', sans-serif;
          cursor:pointer;
          transition:all 0.2s ease;
        }
        .ct-subject-chip:hover{
          border-color:var(--green);
          color:var(--green);
        }
        .ct-subject-chip.active{
          background:var(--green);
          border-color:var(--green);
          color:#fff;
          box-shadow:0 4px 12px rgba(47,107,79,0.28);
        }

        .ct-submit-btn{
          width:100%;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          background:var(--green);
          color:#fff;
          font-size:15.5px;
          font-weight:700;
          font-family:'Inter', sans-serif;
          padding:16px 32px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          transition:background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 22px rgba(47,107,79,0.3);
          margin-top:6px;
        }
        .ct-submit-btn:hover:not(:disabled){
          background:var(--green-bright);
          transform:translateY(-2px);
          box-shadow:0 12px 28px rgba(47,107,79,0.38);
        }
        .ct-submit-btn:active:not(:disabled){ transform:translateY(0); }
        .ct-submit-btn:disabled{ opacity:0.7; cursor:not-allowed; }
        .ct-submit-btn svg{
          width:16px; height:16px;
          stroke:currentColor; fill:none;
          stroke-width:2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        /* ---------- FAQ ---------- */
        .ct-faq-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:24px;
        }
        .ct-faq-card{
          background:#fff;
          border:1px solid var(--line);
          border-left:4px solid var(--green);
          border-radius:10px;
          padding:32px 30px;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ct-faq-card:hover{
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(21,43,58,0.1);
        }
        .ct-faq-card h4{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:17px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:10px;
          line-height:1.4;
        }
        .ct-faq-card p{
          font-size:14.5px;
          color:var(--text-soft);
          line-height:1.7;
        }

        /* ---------- Promise ---------- */
        .ct-promise{
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          color:#fff;
          padding:80px 0;
          position:relative;
          overflow:hidden;
          text-align:center;
        }
        .ct-promise::before{
          content:'';
          position:absolute;
          top:-50%; left:50%;
          transform:translateX(-50%);
          width:80%; height:200%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.18), transparent 65%);
          pointer-events:none;
        }
        .ct-promise-inner{
          position:relative;
          z-index:1;
          max-width:640px;
          margin:0 auto;
          padding:0 24px;
        }
        .ct-promise-icon{
          width:64px; height:64px;
          border-radius:50%;
          background:rgba(242,201,76,0.15);
          border:1.5px solid rgba(242,201,76,0.3);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 20px;
        }
        .ct-promise-icon svg{
          width:28px; height:28px;
          stroke:var(--gold);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .ct-promise h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 36px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:12px;
        }
        .ct-promise p{
          font-size:16px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .ct-container{ padding:0 32px; }
          .ct-hero{ padding:110px 0 80px; }
          .ct-contact-grid{ grid-template-columns:1fr; max-width:520px; margin:0 auto; }
          .ct-faq-grid{ grid-template-columns:1fr; }
        }
        @media (max-width: 640px){
          .ct-container{ padding:0 22px; }
          .ct-section{ padding:72px 0; }
          .ct-hero{ padding:90px 0 70px; }
          .ct-form-wrapper{ padding:36px 26px; }
          .ct-form-row{ grid-template-columns:1fr; gap:0; }
          .ct-social-card{ min-width:100%; }
        }
        @media (prefers-reduced-motion: reduce){
          .ct-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="ct-page">

        {/* ============ PAGE HERO ============ */}
        <section className="ct-hero">
          <div className="ct-hero-inner">
            <span className="ct-eyebrow"><span className="dot"></span> Get in Touch</span>
            <h1>Contact <span className="accent">Us</span></h1>
            <p>
              We'd love to hear from you — whether you want to partner, volunteer,
              or simply ask a question.
            </p>
          </div>
        </section>

        {/* ============ CONTACT INFO ============ */}
        <section className="ct-section">
          <div className="ct-container">
            <div className="ct-section-head center">
              <span className="ct-eyebrow"><span className="dot"></span> Contact Information</span>
              <h2>Reach us directly</h2>
              <p>Choose the channel that works best for you — we're here to help.</p>
            </div>

            <div className="ct-contact-grid">
              <div className="ct-contact-card">
                <div className="ct-contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <h3>Phone</h3>
                <p>+250 784 769 382</p>
                <p>+250 792 588 272</p>
              </div>

              <div className="ct-contact-card">
                <div className="ct-contact-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <h3>Email</h3>
                <p>raisingleaderofgeneration@gmail.com</p>
              </div>

              <div className="ct-contact-card">
                <div className="ct-contact-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3>Location</h3>
                <p>Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SOCIAL MEDIA ============ */}
        <section className="ct-section ct-section-gray">
          <div className="ct-container">
            <div className="ct-section-head center">
              <span className="ct-eyebrow"><span className="dot"></span> Follow Us</span>
              <h2>Connect on social media</h2>
              <p>Stay updated with our latest programs, events, and stories.</p>
            </div>

            <div className="ct-social-grid">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-social-card"
              >
                <div className="ct-social-icon facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </div>
                <h4>Facebook</h4>
                <p>@RLG RWANDA</p>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-social-card"
              >
                <div className="ct-social-icon twitter">
                  <svg viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </div>
                <h4>Twitter</h4>
                <p>@RLG RWANDA</p>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-social-card"
              >
                <div className="ct-social-icon instagram">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                  </svg>
                </div>
                <h4>Instagram</h4>
                <p>@RLG RWANDA</p>
              </a>
            </div>
          </div>
        </section>

        {/* ============ CONTACT FORM ============ */}
        <section className="ct-section">
          <div className="ct-container">
            <div className="ct-section-head center">
              <span className="ct-eyebrow"><span className="dot"></span> Send a Message</span>
              <h2>We'd love to hear from you</h2>
              <p>Fill out the form and we'll respond within 2–3 business days.</p>
            </div>

            <div className="ct-form-wrapper">
              <form onSubmit={handleSubmit} noValidate>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ct-field">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="ct-field">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+250..."
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="ct-field">
                  <label>Subject *</label>
                  <div className="ct-subject-chips">
                    {subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`ct-subject-chip ${
                          form.subject === s ? "active" : ""
                        }`}
                        onClick={() => setForm({ ...form, subject: s })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ct-field">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="ct-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="ct-section ct-section-gray">
          <div className="ct-container">
            <div className="ct-section-head center">
              <span className="ct-eyebrow"><span className="dot"></span> FAQs</span>
              <h2>Frequently asked questions</h2>
              <p>Quick answers to the questions we hear most often.</p>
            </div>

            <div className="ct-faq-grid">
              {faqs.map((f, i) => (
                <div key={i} className="ct-faq-card">
                  <h4>{f.q}</h4>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROMISE ============ */}
        <section className="ct-promise">
          <div className="ct-promise-inner">
            <div className="ct-promise-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2>Quick Response Promise</h2>
            <p>We reply to all messages within 2–3 business days.</p>
          </div>
        </section>

      </div>
    </>
  );
}