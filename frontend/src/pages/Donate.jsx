import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- Data ---------- */
const amounts = ["$10", "$25", "$50", "$100", "$250", "custom"];

const payMethods = [
  {
    key: "mobile_money_mtn",
    label: "MTN MoMo",
    info: ["Dial *182*1# or send via Merchant Code", "MTN MoMo Code: 123456"],
    needsPhone: true,
    iconPath:
      "M12 2C8 2 5 5 5 9v6c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7zm0 2c2.8 0 5 2.2 5 5v6c0 2.8-2.2 5-5 5s-5-2.2-5-5V9c0-2.8 2.2-5 5-5zm0 14c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z",
  },
  {
    key: "mobile_money_airtel",
    label: "Airtel Money",
    info: ["Dial *500*1# or send via Merchant Code", "Airtel Pay Code: 654321"],
    needsPhone: true,
    iconPath:
      "M12 2C8 2 5 5 5 9v6c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7zm0 2c2.8 0 5 2.2 5 5v6c0 2.8-2.2 5-5 5s-5-2.2-5-5V9c0-2.8 2.2-5 5-5zm0 14c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z",
  },
  {
    key: "bank_transfer",
    label: "Bank Transfer",
    info: ["Bank: Bank of Kigali", "Account: 0041-0000-0000", "Beneficiary: RLG"],
    needsPhone: false,
    iconPath:
      "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3",
  },
  {
    key: "credit_card",
    label: "Credit / Debit Card",
    info: ["Visa, Mastercard, Amex", "Secure payment via card"],
    needsPhone: false,
    iconPath: "M2 5h20v14H2zM2 10h20",
  },
];

const impacts = [
  {
    title: "Sponsor a Student",
    desc: "Fund one student's full leadership bootcamp experience — training, mentorship, and materials.",
    amount: "$30",
    iconPath: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  },
  {
    title: "Support a Club",
    desc: "Supply an RLG club with resources and coordination for an entire school term.",
    amount: "$100",
    iconPath:
      "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87",
  },
  {
    title: "Fund a Debate",
    desc: "Power a full debate competition day — venue, judges, awards, and student transport.",
    amount: "$250",
    iconPath:
      "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  },
  {
    title: "Green Life Project",
    desc: "Plant a school garden and fund a sustainability project that teaches environmental stewardship.",
    amount: "$500",
    iconPath: "M12 2v20M2 12h20",
  },
];

export default function Donate() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "$25",
    customAmount: "",
    paymentMethod: "",
    mobileMoneyNumber: "",
    isMonthly: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Lock body scroll while modal open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const finalAmount =
    form.amount === "custom"
      ? form.customAmount
        ? `$${form.customAmount}`
        : ""
      : form.amount;

  const amountNumeric =
    parseFloat(String(finalAmount).replace(/[^0-9.]/g, "")) || 0;

  const selectedMethod = payMethods.find((m) => m.key === form.paymentMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in your name and email address.",
        confirmButtonColor: "#2f6b4f",
      });
      return;
    }
    if (amountNumeric <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select or enter a donation amount.",
        confirmButtonColor: "#2f6b4f",
      });
      return;
    }
    if (!form.paymentMethod) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please choose a payment method.",
        confirmButtonColor: "#2f6b4f",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const r = await fetch(`${API_URL}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          amount: amountNumeric,
          currency: "USD",
          isMonthly: form.isMonthly,
          paymentMethod:
            form.paymentMethod === "bank_transfer"
              ? "bank_transfer"
              : form.paymentMethod === "credit_card"
              ? "credit_card"
              : "mobile_money",
          mobileMoneyNumber: form.mobileMoneyNumber,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed to process donation");

      await Swal.fire({
        icon: "success",
        title: "Thank You for Your Generosity!",
        html: `
          <p>Your pledge of <b>${finalAmount}</b> is being processed.</p>
          <hr style="margin:12px 0;border:none;border-top:1px solid #eee"/>
          <p style="text-align:left;font-size:.9rem;color:#374151">
            <b>${selectedMethod?.label}</b><br/>${(selectedMethod?.info || []).join(
          "<br/>"
        )}
          </p>
          <p style="font-size:.85rem;color:#6b7280">Confirm payment via your mobile money or bank, then our team verifies your gift.</p>
        `,
        confirmButtonColor: "#2f6b4f",
        confirmButtonText: "Done",
      });

      setOpen(false);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        amount: "$25",
        customAmount: "",
        paymentMethod: "",
        mobileMoneyNumber: "",
        isMonthly: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#2f6b4f",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* ============================================================
           DONATE PAGE — matches HTML exactly
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

        .dn-page{
          background:var(--paper);
          color:var(--text);
          font-family:'Inter', system-ui, -apple-system, sans-serif;
          font-size:16px;
          line-height:1.5;
        }
        .dn-page *{ box-sizing:border-box; }
        .dn-page img{ max-width:100%; display:block; }

        .dn-container{
          max-width:1280px;
          margin:0 auto;
          padding:0 48px;
        }
        .dn-section{
          padding:100px 0;
          position:relative;
        }
        .dn-section-gray{
          background:linear-gradient(180deg, var(--paper) 0%, var(--paper-dim) 100%);
        }

        .dn-eyebrow{
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
        .dn-eyebrow .dot{
          width:6px; height:6px;
          border-radius:50%;
          background:var(--gold);
        }

        /* ---------- Page Hero ---------- */
        .dn-hero{
          position:relative;
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          padding:140px 0 100px;
          overflow:hidden;
          color:#fff;
        }
        .dn-hero::before{
          content:'';
          position:absolute;
          top:-40%; left:-10%;
          width:70%; height:180%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.25), transparent 65%);
          pointer-events:none;
        }
        .dn-hero::after{
          content:'';
          position:absolute;
          bottom:-50%; right:-10%;
          width:60%; height:160%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.12), transparent 65%);
          pointer-events:none;
        }
        .dn-hero-inner{
          position:relative;
          z-index:1;
          max-width:1200px;
          margin:0 auto;
          padding:0 48px;
          display:grid;
          grid-template-columns:1.2fr 0.8fr;
          gap:64px;
          align-items:center;
        }
        .dn-hero-left .dn-eyebrow{
          color:var(--green-light);
        }
        .dn-hero-left h1{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(38px, 5vw, 58px);
          line-height:1.08;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:20px;
        }
        .dn-hero-left h1 .accent{ color:var(--gold); }
        .dn-hero-left p{
          font-size:clamp(16px, 1.3vw, 18px);
          line-height:1.7;
          color:rgba(255,255,255,0.82);
          max-width:540px;
          margin-bottom:32px;
        }
        .dn-hero-actions{
          display:flex;
          gap:14px;
          flex-wrap:wrap;
        }

        .dn-btn-gold{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:var(--gold);
          color:var(--navy-deep);
          font-size:15.5px;
          font-weight:700;
          padding:16px 30px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          transition:background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(242,201,76,0.28);
          font-family:'Inter', sans-serif;
        }
        .dn-btn-gold:hover{
          background:var(--gold-hover);
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(242,201,76,0.38);
        }
        .dn-btn-gold svg{ width:18px; height:18px; }

        .dn-btn-ghost{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:rgba(255,255,255,0.08);
          color:#fff;
          font-size:15px;
          font-weight:600;
          padding:16px 30px;
          border-radius:8px;
          border:1.5px solid rgba(255,255,255,0.25);
          cursor:pointer;
          transition:background 0.2s ease, border-color 0.2s ease;
          font-family:'Inter', sans-serif;
          backdrop-filter:blur(8px);
        }
        .dn-btn-ghost:hover{
          background:rgba(255,255,255,0.15);
          border-color:rgba(255,255,255,0.45);
        }

        /* Hero side card */
        .dn-hero-card{
          background:rgba(255,255,255,0.07);
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.15);
          border-radius:16px;
          padding:36px 32px;
          box-shadow:0 24px 64px rgba(0,0,0,0.3);
          position:relative;
          overflow:hidden;
        }
        .dn-hero-card::before{
          content:'';
          position:absolute;
          top:-50%; right:-30%;
          width:200px; height:200px;
          background:radial-gradient(circle, rgba(242,201,76,0.25), transparent 70%);
          pointer-events:none;
        }
        .dn-hero-card .label{
          font-size:12px;
          font-weight:700;
          letter-spacing:0.12em;
          text-transform:uppercase;
          color:var(--green-light);
          margin-bottom:16px;
        }
        .dn-hero-card .big-num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:52px;
          font-weight:700;
          line-height:1;
          color:#fff;
          margin-bottom:8px;
        }
        .dn-hero-card .big-num .plus{ color:var(--gold); }
        .dn-hero-card .big-desc{
          font-size:14px;
          color:rgba(255,255,255,0.7);
          margin-bottom:24px;
          padding-bottom:24px;
          border-bottom:1px solid rgba(255,255,255,0.12);
        }
        .dn-hero-card-stats{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }
        .dn-hero-card-stat .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:26px;
          font-weight:700;
          color:#fff;
          line-height:1;
          margin-bottom:6px;
        }
        .dn-hero-card-stat .num .plus{ color:var(--gold); }
        .dn-hero-card-stat .lbl{
          font-size:12.5px;
          color:rgba(255,255,255,0.65);
          line-height:1.4;
        }

        /* ---------- Section heads ---------- */
        .dn-section-head{
          max-width:640px;
          margin-bottom:48px;
        }
        .dn-section-head.center{
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
        .dn-section-head h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 38px);
          line-height:1.18;
          letter-spacing:-0.02em;
          color:var(--navy);
          margin-bottom:14px;
        }
        .dn-section-head p{
          font-size:15.5px;
          color:var(--text-soft);
          line-height:1.7;
        }

        /* ---------- Impact Grid ---------- */
        .dn-impact-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:24px;
        }
        .dn-impact-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:36px 28px;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position:relative;
          overflow:hidden;
          display:flex;
          flex-direction:column;
        }
        .dn-impact-card::before{
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:3px;
          background:linear-gradient(90deg, var(--green), var(--green-light), var(--gold));
          opacity:0;
          transition:opacity 0.25s ease;
        }
        .dn-impact-card:hover{
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(21,43,58,0.12);
          border-color:var(--green-light);
        }
        .dn-impact-card:hover::before{ opacity:1; }

        .dn-impact-icon{
          width:56px; height:56px;
          border-radius:14px;
          background:linear-gradient(135deg, rgba(47,107,79,0.14), rgba(63,140,99,0.06));
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:20px;
          transition:background 0.25s ease;
        }
        .dn-impact-card:hover .dn-impact-icon{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
        }
        .dn-impact-icon svg{
          width:26px; height:26px;
          stroke:var(--green);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
          transition:stroke 0.25s ease;
        }
        .dn-impact-card:hover .dn-impact-icon svg{
          stroke:#fff;
        }
        .dn-impact-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:17px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:8px;
          line-height:1.35;
        }
        .dn-impact-card p{
          font-size:13.5px;
          color:var(--text-soft);
          line-height:1.65;
          margin-bottom:18px;
          flex:1;
        }
        .dn-impact-amount{
          display:inline-flex;
          align-items:center;
          align-self:flex-start;
          font-family:'Source Serif 4', Georgia, serif;
          font-size:20px;
          font-weight:700;
          color:var(--green-deep);
          padding:6px 16px;
          border-radius:100px;
          background:rgba(47,107,79,0.1);
        }

        /* ---------- Payment Grid ---------- */
        .dn-payment-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:24px;
        }
        .dn-payment-card{
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:32px 28px;
          transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          display:flex;
          flex-direction:column;
        }
        .dn-payment-card:hover{
          transform:translateY(-6px);
          box-shadow:0 20px 44px rgba(21,43,58,0.1);
          border-color:var(--green-light);
        }
        .dn-payment-icon{
          width:52px; height:52px;
          border-radius:12px;
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:18px;
          box-shadow:0 6px 18px rgba(47,107,79,0.28);
        }
        .dn-payment-icon svg{
          width:24px; height:24px;
          stroke:#fff;
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .dn-payment-card h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:17px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:14px;
          line-height:1.35;
        }
        .dn-payment-card ul{
          list-style:none;
          display:grid;
          gap:8px;
          margin-bottom:20px;
          flex:1;
          padding:0;
        }
        .dn-payment-card li{
          display:flex;
          gap:8px;
          align-items:flex-start;
          font-size:13px;
          color:var(--text-soft);
          line-height:1.55;
        }
        .dn-payment-card li svg{
          width:14px; height:14px;
          stroke:var(--green);
          fill:none;
          stroke-width:2.4;
          stroke-linecap:round;
          stroke-linejoin:round;
          flex-shrink:0;
          margin-top:3px;
        }
        .dn-pay-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:11px 20px;
          border-radius:8px;
          border:1.5px solid var(--green);
          background:transparent;
          color:var(--green);
          font-size:13px;
          font-weight:700;
          font-family:'Inter', sans-serif;
          cursor:pointer;
          transition:background 0.2s ease, color 0.2s ease;
          width:100%;
        }
        .dn-pay-btn:hover{
          background:var(--green);
          color:#fff;
        }

        /* Contact strip */
        .dn-contact-strip{
          max-width:820px;
          margin:56px auto 0;
          background:#fff;
          border:1px solid var(--line);
          border-left:4px solid var(--green);
          border-radius:12px;
          padding:24px 32px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:24px;
          flex-wrap:wrap;
        }
        .dn-contact-strip-item{
          display:flex;
          align-items:center;
          gap:12px;
          font-size:14px;
          color:var(--text);
        }
        .dn-contact-strip-item .icon{
          width:40px; height:40px;
          border-radius:10px;
          background:rgba(47,107,79,0.1);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }
        .dn-contact-strip-item .icon svg{
          width:18px; height:18px;
          stroke:var(--green);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .dn-contact-strip-item strong{
          display:block;
          font-size:12.5px;
          color:var(--text-soft);
          font-weight:600;
          margin-bottom:2px;
          letter-spacing:0.02em;
        }
        .dn-contact-strip-item span{
          font-weight:600;
          color:var(--navy);
          font-size:14.5px;
        }

        /* ---------- Trust ---------- */
        .dn-trust{
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          color:#fff;
          position:relative;
          overflow:hidden;
          padding:90px 0;
        }
        .dn-trust::before{
          content:'';
          position:absolute;
          top:-50%; left:50%;
          transform:translateX(-50%);
          width:100%; height:200%;
          background:radial-gradient(ellipse, rgba(143,193,163,0.18), transparent 60%);
          pointer-events:none;
        }
        .dn-trust-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:760px;
          margin:0 auto;
          padding:0 24px;
        }
        .dn-trust-icon{
          width:72px; height:72px;
          border-radius:50%;
          background:rgba(242,201,76,0.15);
          border:1.5px solid rgba(242,201,76,0.3);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 24px;
        }
        .dn-trust-icon svg{
          width:32px; height:32px;
          stroke:var(--gold);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .dn-trust h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3vw, 38px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:16px;
        }
        .dn-trust p{
          font-size:16px;
          color:rgba(255,255,255,0.82);
          line-height:1.75;
          margin-bottom:32px;
        }
        .dn-trust p a{
          color:var(--green-light);
          text-decoration:underline;
          text-underline-offset:3px;
        }
        .dn-trust-stats{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:32px;
          margin-top:48px;
          padding-top:40px;
          border-top:1px solid rgba(255,255,255,0.12);
        }
        .dn-trust-stat .num{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:34px;
          font-weight:700;
          color:#fff;
          line-height:1;
          margin-bottom:8px;
        }
        .dn-trust-stat .num .plus{ color:var(--gold); }
        .dn-trust-stat .lbl{
          font-size:13.5px;
          color:rgba(255,255,255,0.7);
          line-height:1.5;
        }

        .dn-btn-white{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:#fff;
          color:var(--green-deep);
          font-size:15.5px;
          font-weight:700;
          padding:16px 32px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          transition:transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow:0 8px 24px rgba(0,0,0,0.15);
          font-family:'Inter', sans-serif;
        }
        .dn-btn-white:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(0,0,0,0.22);
        }

        /* ---------- Modal ---------- */
        .dn-modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(6,15,22,0.75);
          backdrop-filter:blur(6px);
          z-index:3000;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          opacity:0;
          visibility:hidden;
          transition:opacity 0.25s ease, visibility 0.25s ease;
          overflow-y:auto;
        }
        .dn-modal-overlay.open{
          opacity:1;
          visibility:visible;
        }
        .dn-modal{
          background:#fff;
          border-radius:18px;
          width:100%;
          max-width:600px;
          box-shadow:0 32px 80px rgba(0,0,0,0.4);
          margin:auto;
          overflow:hidden;
          transform:translateY(20px);
          transition:transform 0.3s ease;
        }
        .dn-modal-overlay.open .dn-modal{
          transform:translateY(0);
        }
        .dn-modal-header{
          background:linear-gradient(135deg, var(--navy) 0%, var(--green-deep) 100%);
          color:#fff;
          padding:26px 32px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          position:relative;
          overflow:hidden;
        }
        .dn-modal-header::before{
          content:'';
          position:absolute;
          top:-50%; right:-20%;
          width:200px; height:200px;
          background:radial-gradient(circle, rgba(242,201,76,0.2), transparent 70%);
          pointer-events:none;
        }
        .dn-modal-header-content{
          position:relative;
          z-index:1;
        }
        .dn-modal-header h3{
          font-family:'Source Serif 4', Georgia, serif;
          font-size:20px;
          font-weight:600;
          color:#fff;
          margin-bottom:4px;
          display:flex;
          align-items:center;
          gap:10px;
        }
        .dn-modal-header h3 svg{
          width:20px; height:20px;
          fill:var(--gold);
          stroke:none;
        }
        .dn-modal-header p{
          font-size:13.5px;
          color:rgba(255,255,255,0.75);
        }
        .dn-modal-close{
          position:relative;
          z-index:1;
          width:38px; height:38px;
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
        .dn-modal-close:hover{
          background:rgba(255,255,255,0.2);
          transform:rotate(90deg);
        }
        .dn-modal-close svg{
          width:16px; height:16px;
          stroke:currentColor;
          fill:none;
          stroke-width:2.2;
          stroke-linecap:round;
          stroke-linejoin:round;
        }
        .dn-modal-body{
          padding:32px;
          max-height:65vh;
          overflow-y:auto;
        }
        .dn-modal-body::-webkit-scrollbar{ width:6px; }
        .dn-modal-body::-webkit-scrollbar-track{ background:transparent; }
        .dn-modal-body::-webkit-scrollbar-thumb{ background:var(--line); border-radius:3px; }

        .dn-field-label{
          display:block;
          font-size:12.5px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          color:var(--navy);
          margin-bottom:12px;
        }

        /* Amount chips */
        .dn-amount-chips{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin-bottom:24px;
        }
        .dn-amount-chip{
          padding:12px 22px;
          border-radius:10px;
          border:1.5px solid var(--line);
          background:#fff;
          color:var(--navy);
          font-size:15px;
          font-weight:700;
          font-family:'Inter', sans-serif;
          cursor:pointer;
          transition:all 0.2s ease;
          flex:1 1 auto;
          min-width:80px;
          text-align:center;
        }
        .dn-amount-chip:hover{
          border-color:var(--green);
          color:var(--green);
        }
        .dn-amount-chip.active{
          background:var(--green);
          border-color:var(--green);
          color:#fff;
          box-shadow:0 4px 12px rgba(47,107,79,0.28);
        }

        .dn-modal-field{ margin-bottom:18px; }
        .dn-modal-field label{
          display:block;
          font-size:13px;
          font-weight:600;
          color:var(--navy);
          margin-bottom:7px;
        }
        .dn-modal-field input,
        .dn-modal-field textarea{
          width:100%;
          padding:13px 15px;
          border:1.5px solid var(--line);
          border-radius:8px;
          font-size:14.5px;
          font-family:'Inter', sans-serif;
          color:var(--text);
          background:var(--paper);
          transition:border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          outline:none;
        }
        .dn-modal-field input:focus,
        .dn-modal-field textarea:focus{
          border-color:var(--green);
          background:#fff;
          box-shadow:0 0 0 4px rgba(47,107,79,0.1);
        }
        .dn-modal-field input::placeholder{ color:#9AA0A6; }

        .dn-modal-row{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
        }

        /* Payment method tiles */
        .dn-method-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-bottom:18px;
        }
        .dn-method-tile{
          display:flex;
          align-items:center;
          gap:10px;
          padding:14px 16px;
          border-radius:10px;
          border:1.5px solid var(--line);
          background:#fff;
          cursor:pointer;
          transition:all 0.2s ease;
          font-family:'Inter', sans-serif;
          font-size:13.5px;
          font-weight:600;
          color:var(--text);
          text-align:left;
        }
        .dn-method-tile:hover{
          border-color:var(--green);
        }
        .dn-method-tile.active{
          border:2px solid var(--green);
          background:rgba(47,107,79,0.06);
          color:var(--navy);
        }
        .dn-method-tile svg{
          width:18px; height:18px;
          stroke:var(--green);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
          flex-shrink:0;
        }

        /* Payment details box */
        .dn-payment-details{
          background:linear-gradient(135deg, rgba(47,107,79,0.06), rgba(143,193,163,0.08));
          border:1px solid rgba(143,193,163,0.4);
          border-radius:10px;
          padding:16px 18px;
          margin-bottom:18px;
        }
        .dn-payment-details .title{
          font-size:12.5px;
          font-weight:700;
          letter-spacing:0.06em;
          text-transform:uppercase;
          color:var(--green-deep);
          margin-bottom:10px;
        }
        .dn-payment-details .detail-line{
          font-size:13.5px;
          color:var(--text);
          line-height:1.6;
          display:flex;
          gap:8px;
          align-items:flex-start;
        }
        .dn-payment-details .detail-line::before{
          content:'•';
          color:var(--green);
          font-weight:700;
          flex-shrink:0;
        }

        /* Checkbox */
        .dn-checkbox-label{
          display:flex;
          align-items:center;
          gap:10px;
          font-size:14px;
          color:var(--text);
          margin-bottom:20px;
          cursor:pointer;
          padding:14px 16px;
          border-radius:10px;
          border:1.5px solid var(--line);
          background:var(--paper);
          transition:border-color 0.2s ease;
        }
        .dn-checkbox-label:hover{
          border-color:var(--green-light);
        }
        .dn-checkbox-label input{
          width:18px; height:18px;
          accent-color:var(--green);
          cursor:pointer;
          flex-shrink:0;
        }
        .dn-checkbox-label strong{ color:var(--navy); }

        /* Submit */
        .dn-modal-submit{
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
          margin-bottom:14px;
        }
        .dn-modal-submit:hover:not(:disabled){
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(47,107,79,0.4);
        }
        .dn-modal-submit:disabled{ opacity:0.7; cursor:not-allowed; }
        .dn-modal-submit svg{
          width:18px; height:18px;
          fill:currentColor;
          stroke:none;
        }

        .dn-modal-secure{
          font-size:12.5px;
          color:var(--text-soft);
          text-align:center;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:6px;
        }
        .dn-modal-secure svg{
          width:13px; height:13px;
          stroke:var(--green);
          fill:none;
          stroke-width:1.8;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        /* ---------- Bottom CTA ---------- */
        .dn-bottom-cta{
          background:linear-gradient(135deg, var(--green) 0%, var(--green-deep) 100%);
          position:relative;
          overflow:hidden;
          padding:80px 0;
        }
        .dn-bottom-cta::before{
          content:'';
          position:absolute;
          top:-60%; right:-10%;
          width:60%; height:220%;
          background:radial-gradient(ellipse, rgba(242,201,76,0.15), transparent 65%);
          pointer-events:none;
        }
        .dn-bottom-cta-inner{
          position:relative;
          z-index:1;
          text-align:center;
          max-width:720px;
          margin:0 auto;
        }
        .dn-bottom-cta h2{
          font-family:'Source Serif 4', Georgia, serif;
          font-weight:600;
          font-size:clamp(28px, 3.5vw, 38px);
          line-height:1.2;
          letter-spacing:-0.02em;
          color:#fff;
          margin-bottom:16px;
        }
        .dn-bottom-cta p{
          font-size:16px;
          color:rgba(255,255,255,0.82);
          line-height:1.7;
          margin-bottom:32px;
        }
        .dn-bottom-cta-actions{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:16px;
          flex-wrap:wrap;
        }
        .dn-btn-outline-white{
          display:inline-flex;
          align-items:center;
          gap:10px;
          background:transparent;
          color:#fff;
          font-size:15.5px;
          font-weight:600;
          padding:16px 32px;
          border-radius:8px;
          border:1.5px solid rgba(255,255,255,0.4);
          cursor:pointer;
          text-decoration:none;
          transition:background 0.2s ease, border-color 0.2s ease;
          font-family:'Inter', sans-serif;
        }
        .dn-btn-outline-white:hover{
          background:rgba(255,255,255,0.1);
          border-color:rgba(255,255,255,0.7);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1024px){
          .dn-container{ padding:0 32px; }
          .dn-hero{ padding:110px 0 80px; }
          .dn-hero-inner{
            grid-template-columns:1fr;
            gap:48px;
            padding:0 32px;
          }
          .dn-impact-grid{ grid-template-columns:repeat(2, 1fr); }
          .dn-payment-grid{ grid-template-columns:repeat(2, 1fr); }
        }
        @media (max-width: 640px){
          .dn-container{ padding:0 22px; }
          .dn-section{ padding:72px 0; }
          .dn-hero{ padding:90px 0 60px; }
          .dn-hero-inner{ padding:0 22px; }
          .dn-hero-actions{ flex-direction:column; }
          .dn-btn-gold, .dn-btn-ghost{ width:100%; justify-content:center; }
          .dn-impact-grid{ grid-template-columns:1fr; }
          .dn-payment-grid{ grid-template-columns:1fr; }
          .dn-modal-body{ padding:24px; }
          .dn-modal-header{ padding:20px 24px; }
          .dn-modal-row{ grid-template-columns:1fr; }
          .dn-method-grid{ grid-template-columns:1fr; }
          .dn-trust-stats{ grid-template-columns:1fr; gap:24px; }
          .dn-contact-strip{ flex-direction:column; align-items:flex-start; }
          .dn-bottom-cta-actions{ flex-direction:column; }
          .dn-btn-white, .dn-btn-outline-white{ width:100%; justify-content:center; }
        }
        @media (prefers-reduced-motion: reduce){
          .dn-page *{ transition:none !important; animation:none !important; }
        }
      `}</style>

      <div className="dn-page">

        {/* ============ PAGE HERO ============ */}
        <section className="dn-hero">
          <div className="dn-hero-inner">
            <div className="dn-hero-left">
              <span className="dn-eyebrow"><span className="dot"></span> Make a Difference</span>
              <h1>
                Your gift <span className="accent">transforms</span> young lives.
              </h1>
              <p>
                Every contribution funds clubs, debates, bootcamps, and sustainability
                projects that empower the next generation of leaders in Rwanda.
              </p>
              <div className="dn-hero-actions">
                <button className="dn-btn-gold" onClick={() => setOpen(true)}>
                  Donate Now
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
                <button className="dn-btn-ghost" onClick={() => setOpen(true)}>
                  Other Ways to Give
                </button>
              </div>
            </div>

            <aside className="dn-hero-card">
              <div className="label">Your Impact at a Glance</div>
              <div className="big-num">89<span className="plus">¢</span></div>
              <div className="big-desc">of every dollar goes directly to programs</div>

              <div className="dn-hero-card-stats">
                <div className="dn-hero-card-stat">
                  <div className="num">5,000<span className="plus">+</span></div>
                  <div className="lbl">Students Reached</div>
                </div>
                <div className="dn-hero-card-stat">
                  <div className="num">120<span className="plus">+</span></div>
                  <div className="lbl">Partner Schools</div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ============ IMPACT ============ */}
        <section className="dn-section">
          <div className="dn-container">
            <div className="dn-section-head center">
              <span className="dn-eyebrow"><span className="dot"></span> Your Impact</span>
              <h2>Where your donation goes</h2>
              <p>Every dollar is invested directly into programs that transform young lives.</p>
            </div>

            <div className="dn-impact-grid">
              {impacts.map((imp, i) => (
                <div key={i} className="dn-impact-card">
                  <div className="dn-impact-icon">
                    <svg viewBox="0 0 24 24">
                      <path d={imp.iconPath} />
                    </svg>
                  </div>
                  <h3>{imp.title}</h3>
                  <p>{imp.desc}</p>
                  <span className="dn-impact-amount">{imp.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PAYMENT METHODS ============ */}
        <section className="dn-section dn-section-gray">
          <div className="dn-container">
            <div className="dn-section-head center">
              <span className="dn-eyebrow"><span className="dot"></span> Payment Options</span>
              <h2>Ways to give</h2>
              <p>Choose the payment method that works best for you.</p>
            </div>

            <div className="dn-payment-grid">
              {payMethods.map((m) => (
                <div key={m.key} className="dn-payment-card">
                  <div className="dn-payment-icon">
                    <svg viewBox="0 0 24 24">
                      <path d={m.iconPath} />
                    </svg>
                  </div>
                  <h3>{m.label}</h3>
                  <ul>
                    {m.info.map((line, j) => (
                      <li key={j}>
                        <svg viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="dn-pay-btn"
                    onClick={() => {
                      setForm({ ...form, paymentMethod: m.key });
                      setOpen(true);
                    }}
                  >
                    Give via {m.label}
                  </button>
                </div>
              ))}
            </div>

            <div className="dn-contact-strip">
              <div className="dn-contact-strip-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <strong>EMAIL US</strong>
                  <span>raisingleaderofgeneration@gmail.com</span>
                </div>
              </div>

              <div className="dn-contact-strip-item">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <strong>CALL US</strong>
                  <span>+250 784 769 382 | +250 792 588 272</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ TRUST ============ */}
        <section className="dn-trust">
          <div className="dn-trust-inner">
            <div className="dn-trust-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2>Secure &amp; transparent giving</h2>
            <p>
              Contributions are used directly for programs. For any receipt or verification,
              email <a href="mailto:raisingleaderofgeneration@gmail.com">raisingleaderofgeneration@gmail.com</a>.
              We're committed to full transparency and accountability.
            </p>

            <button className="dn-btn-white" onClick={() => setOpen(true)}>
              Make a Donation
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            <div className="dn-trust-stats">
              <div className="dn-trust-stat">
                <div className="num">89<span className="plus">%</span></div>
                <div className="lbl">Program Allocation</div>
              </div>
              <div className="dn-trust-stat">
                <div className="num">5,000<span className="plus">+</span></div>
                <div className="lbl">Lives Impacted</div>
              </div>
              <div className="dn-trust-stat">
                <div className="num">100<span className="plus">%</span></div>
                <div className="lbl">Tax Deductible</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ BOTTOM CTA ============ */}
        <section className="dn-bottom-cta">
          <div className="dn-container">
            <div className="dn-bottom-cta-inner">
              <h2>Prefer to give in kind or partner?</h2>
              <p>
                We welcome books, equipment, mentorship time, and organizational
                partnerships. Reach out and let's build something together.
              </p>
              <div className="dn-bottom-cta-actions">
                <Link to="/getinvolved" className="dn-btn-white">
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
                <Link to="/contact" className="dn-btn-outline-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ============ MODAL ============ */}
      <div
        className={`dn-modal-overlay ${open ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="dn-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div className="dn-modal-header">
            <div className="dn-modal-header-content">
              <h3 id="modalTitle">
                <svg viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                Donate to RLG
              </h3>
              <p>Empower a young leader today.</p>
            </div>
            <button
              className="dn-modal-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="dn-modal-body" onSubmit={handleSubmit} noValidate>
            <label className="dn-field-label">Select Amount</label>
            <div className="dn-amount-chips">
              {amounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`dn-amount-chip ${
                    form.amount === a ? "active" : ""
                  }`}
                  onClick={() => setForm({ ...form, amount: a })}
                >
                  {a === "custom" ? "Custom" : a}
                </button>
              ))}
            </div>

            {form.amount === "custom" && (
              <div className="dn-modal-field">
                <label htmlFor="customAmount">Custom Amount (USD)</label>
                <input
                  type="number"
                  id="customAmount"
                  name="customAmount"
                  min="1"
                  placeholder="Enter amount in USD"
                  value={form.customAmount}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="dn-modal-row">
              <div className="dn-modal-field">
                <label htmlFor="fullName">Full Name *</label>
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
              <div className="dn-modal-field">
                <label htmlFor="email">Email Address *</label>
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
            </div>

            <div className="dn-modal-field">
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

            <label className="dn-field-label">Payment Method</label>
            <div className="dn-method-grid">
              {payMethods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`dn-method-tile ${
                    form.paymentMethod === m.key ? "active" : ""
                  }`}
                  onClick={() => setForm({ ...form, paymentMethod: m.key })}
                >
                  <svg viewBox="0 0 24 24">
                    <path d={m.iconPath} />
                  </svg>
                  {m.label}
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div className="dn-payment-details">
                <div className="title">
                  {selectedMethod.label.toUpperCase()} — PAYMENT DETAILS:
                </div>
                {selectedMethod.info.map((line, j) => (
                  <div key={j} className="detail-line">
                    {line}
                  </div>
                ))}
              </div>
            )}

            {selectedMethod?.needsPhone && (
              <div className="dn-modal-field">
                <label htmlFor="mobileMoneyNumber">Your MoMo / Airtel Number</label>
                <input
                  type="tel"
                  id="mobileMoneyNumber"
                  name="mobileMoneyNumber"
                  placeholder="e.g. 0788 123 456"
                  value={form.mobileMoneyNumber}
                  onChange={handleChange}
                />
              </div>
            )}

            <label className="dn-checkbox-label">
              <input
                type="checkbox"
                name="isMonthly"
                checked={form.isMonthly}
                onChange={handleChange}
              />
              Make this a <strong>monthly donation</strong>
            </label>

            <button
              type="submit"
              className="dn-modal-submit"
              disabled={isSubmitting}
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <span>
                {isSubmitting
                  ? "Processing..."
                  : finalAmount
                  ? `Donate ${finalAmount}`
                  : "Donate"}
              </span>
            </button>

            <p className="dn-modal-secure">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure giving. We never share your information.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}