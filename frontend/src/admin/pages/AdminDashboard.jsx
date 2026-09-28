import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBlog, faDollarSign, faEnvelope, faCalendar,
  faSpinner, faImage, faGraduationCap, faComments, faArrowUp, faClock
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const { admin } = useAdmin();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch all dashboard data in parallel
      const [statsRes, blogsRes, contactsRes, donationsRes, programsRes, galleryRes, eventsRes, testimonialsRes] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/blogs?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/contact?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/donations?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/programs', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/gallery', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/testimonials/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const blogsData = await blogsRes.json();
      const contactsData = await contactsRes.json();
      const donationsData = await donationsRes.json();
      const programsData = await programsRes.json();
      const galleryData = await galleryRes.json();
      const eventsData = await eventsRes.json();
      const testimonialsData = await testimonialsRes.json();

      setStats({
        totalUsers: statsData.data?.totalUsers || 0,
        totalBlogs: statsData.data?.totalBlogs || blogsData.data?.blogs?.length || 0,
        totalDonations: statsData.data?.totalDonations || 0,
        pendingContacts: statsData.data?.pendingContacts || 0,
        totalPrograms: programsData.data?.length || 0,
        totalGallery: galleryData.data?.length || 0,
        totalEvents: eventsData.data?.length || 0,
        totalTestimonials: testimonialsData.data?.length || 0,
      });

      setRecentActivities([
        ...(blogsData.data?.blogs?.slice(0, 3).map(b => ({ type: 'blog', title: b.title, date: b.createdAt })) || []),
        ...(contactsData.data?.slice(0, 2).map(c => ({ type: 'contact', name: c.name, date: c.createdAt })) || []),
        ...(donationsData.data?.slice(0, 2).map(d => ({ type: 'donation', amount: d.amount, name: d.fullName, date: d.createdAt })) || [])
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard data. Please refresh the page.',
        confirmButtonColor: '#0f5132',
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total blogs', value: stats?.totalBlogs || 0, icon: faBlog, color: '#2563eb', change: '+12%', link: '/admin/blogs' },
    { title: 'Programs', value: stats?.totalPrograms || 0, icon: faGraduationCap, color: '#0f5132', change: '+5%', link: '/admin/programs' },
    { title: 'Gallery items', value: stats?.totalGallery || 0, icon: faImage, color: '#b45309', change: '+8%', link: '/admin/gallery' },
    { title: 'Events', value: stats?.totalEvents || 0, icon: faCalendar, color: '#6d28d9', change: '+3%', link: '/admin/events' },
    { title: 'Donations', value: `$${(stats?.totalDonations ?? 0).toLocaleString()}`, icon: faDollarSign, color: '#047857', change: '+23%', link: '/admin/donations' },
    { title: 'Pending contacts', value: stats?.pendingContacts || 0, icon: faEnvelope, color: '#b91c1c', change: '-2%', link: '/admin/contacts' },
    { title: 'Testimonials', value: stats?.totalTestimonials || 0, icon: faComments, color: '#0e7490', change: '+15%', link: '/admin/testimonials' },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Welcome back, {admin?.name}!</h1>
          <p className="admin-page-sub">Here&apos;s what&apos;s happening with RLG today.</p>
        </div>
        <div className="admin-page-meta">
          <FontAwesomeIcon icon={faClock} />
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* 4 per row on desktop, 2 on tablet, 1 on mobile */}
      <div className="admin-stat-grid">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="admin-stat-card"
            role="button"
            tabIndex={0}
            onClick={() => window.location.href = stat.link}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = stat.link;
              }
            }}
          >
            <div
              className="admin-stat-icon"
              style={{ background: `${stat.color}15`, color: stat.color }}
            >
              <FontAwesomeIcon icon={stat.icon} />
            </div>

            <div className="admin-stat-value">{stat.value}</div>

            <div className="admin-stat-label">
              <span className="admin-stat-name">{stat.title}</span>
              {stat.change && (
                <span
                  className={`admin-stat-delta ${
                    stat.change.startsWith('+') ? 'positive' : 'negative'
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-split-grid">
        <section className="admin-card">
          <h2 className="admin-card-title">Recent activity</h2>

          {recentActivities.length === 0 ? (
            <p className="admin-empty">Nothing here yet. New activity will appear here.</p>
          ) : (
            <div className="admin-activity-list">
              {recentActivities.map((activity, i) => (
                <div key={i} className="admin-activity-item">
                  <div className={`admin-activity-icon ${activity.type}`}>
                    {activity.type === 'blog' && <FontAwesomeIcon icon={faBlog} />}
                    {activity.type === 'contact' && <FontAwesomeIcon icon={faEnvelope} />}
                    {activity.type === 'donation' && <FontAwesomeIcon icon={faDollarSign} />}
                  </div>
                  <div className="admin-activity-text">
                    <p>
                      {activity.type === 'blog' && `New blog: ${activity.title}`}
                      {activity.type === 'contact' && `New message from ${activity.name}`}
                      {activity.type === 'donation' &&
                        `Donation of $${activity.amount} from ${activity.name}`}
                    </p>
                    <small>{new Date(activity.date).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-card">
          <h2 className="admin-card-title">Quick actions</h2>
          <div className="admin-quick-grid">
            <button
              onClick={() => window.location.href = '/admin/blogs/new'}
              className="admin-quick-btn"
              type="button"
            >
              <FontAwesomeIcon icon={faBlog} /> Create blog
            </button>
            <button
              onClick={() => window.location.href = '/admin/gallery/upload'}
              className="admin-quick-btn"
              type="button"
            >
              <FontAwesomeIcon icon={faImage} /> Upload image
            </button>
            <button
              onClick={() => window.location.href = '/admin/programs/new'}
              className="admin-quick-btn"
              type="button"
            >
              <FontAwesomeIcon icon={faGraduationCap} /> Add program
            </button>
            <button
              onClick={() => window.location.href = '/admin/events/new'}
              className="admin-quick-btn"
              type="button"
            >
              <FontAwesomeIcon icon={faCalendar} /> Create event
            </button>
          </div>
        </section>
      </div>

      {showScrollTop && (
        <button
          className="admin-scroll-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          type="button"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;