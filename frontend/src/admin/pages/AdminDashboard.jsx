import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faBlog, faDollarSign, faEnvelope, faCalendar,
  faEye, faHeart, faUserPlus, faSpinner, faImage,
  faGraduationCap, faComments, faChartLine, faArrowUp,
  faCheckCircle, faTimesCircle, faClock
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
        confirmButtonColor: '#22c55e',
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Blogs', value: stats?.totalBlogs || 0, icon: faBlog, color: '#3b82f6', change: '+12%', link: '/admin/blogs' },
    { title: 'Programs', value: stats?.totalPrograms || 0, icon: faGraduationCap, color: '#22c55e', change: '+5%', link: '/admin/programs' },
    { title: 'Gallery Items', value: stats?.totalGallery || 0, icon: faImage, color: '#f59e0b', change: '+8%', link: '/admin/gallery' },
    { title: 'Events', value: stats?.totalEvents || 0, icon: faCalendar, color: '#8b5cf6', change: '+3%', link: '/admin/events' },
    { title: 'Donations', value: `$${stats?.totalDonations?.toLocaleString() || 0}`, icon: faDollarSign, color: '#10b981', change: '+23%', link: '/admin/donations' },
    { title: 'Pending Contacts', value: stats?.pendingContacts || 0, icon: faEnvelope, color: '#ef4444', change: '-2%', link: '/admin/contacts' },
    { title: 'Testimonials', value: stats?.totalTestimonials || 0, icon: faComments, color: '#06b6d4', change: '+15%', link: '/admin/testimonials' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {admin?.name}!</h1>
          <p>Here's what's happening with RLG today.</p>
        </div>
        <div className="dashboard-date">
          <FontAwesomeIcon icon={faClock} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" onClick={() => window.location.href = stat.link}>
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              {stat.change && <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>{stat.change}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivities.map((activity, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'blog' && <FontAwesomeIcon icon={faBlog} />}
                  {activity.type === 'contact' && <FontAwesomeIcon icon={faEnvelope} />}
                  {activity.type === 'donation' && <FontAwesomeIcon icon={faDollarSign} />}
                </div>
                <div className="activity-details">
                  <p>
                    {activity.type === 'blog' && `New blog: ${activity.title}`}
                    {activity.type === 'contact' && `New message from ${activity.name}`}
                    {activity.type === 'donation' && `Donation of $${activity.amount} from ${activity.name}`}
                  </p>
                  <small>{new Date(activity.date).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button onClick={() => window.location.href = '/admin/blogs/new'} className="quick-action-btn">
              <FontAwesomeIcon icon={faBlog} /> Create Blog
            </button>
            <button onClick={() => window.location.href = '/admin/gallery/upload'} className="quick-action-btn">
              <FontAwesomeIcon icon={faImage} /> Upload Image
            </button>
            <button onClick={() => window.location.href = '/admin/programs/new'} className="quick-action-btn">
              <FontAwesomeIcon icon={faGraduationCap} /> Add Program
            </button>
            <button onClick={() => window.location.href = '/admin/events/new'} className="quick-action-btn">
              <FontAwesomeIcon icon={faCalendar} /> Create Event
            </button>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}

      <style>{`
        .admin-dashboard {
          animation: fadeIn 0.5s ease;
          padding: 20px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .dashboard-header h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .dashboard-header p {
          color: #6b7280;
        }

        .dashboard-date {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-info h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .stat-info p {
          color: #6b7280;
          font-size: 14px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;
        }

        .stat-change.positive { color: #22c55e; }
        .stat-change.negative { color: #ef4444; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .dashboard-card h3 {
          font-size: 18px;
          color: #374151;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0fdf4;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 8px;
          background: #f9fafb;
          transition: background 0.3s ease;
        }

        .activity-item:hover {
          background: #f0fdf4;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .activity-icon.blog { background: #dbeafe; color: #3b82f6; }
        .activity-icon.contact { background: #fee2e2; color: #ef4444; }
        .activity-icon.donation { background: #d1fae5; color: #10b981; }

        .activity-details p {
          font-size: 14px;
          color: #374151;
          margin-bottom: 4px;
        }

        .activity-details small {
          font-size: 11px;
          color: #9ca3af;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .quick-action-btn:hover {
          background: #22c55e;
          color: white;
          transform: translateY(-2px);
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 20px;
          color: #22c55e;
        }

        .scroll-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 45px;
          height: 45px;
          background: #22c55e;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(34,197,94,0.3);
        }

        .scroll-top:hover {
          background: #16a34a;
          transform: translateY(-3px);
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-header {
            flex-direction: column;
            text-align: center;
          }
          
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;