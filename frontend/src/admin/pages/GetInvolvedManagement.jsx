import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEnvelope, faCheckCircle, faTimesCircle, faSpinner, faPhone, faMapMarkerAlt, faBuilding, faTag, faUsers, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const GetInvolvedManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [submissionsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/getinvolved', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/getinvolved/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const submissionsData = await submissionsRes.json();
      const statsData = await statsRes.json();
      
      setSubmissions(submissionsData.data || []);
      setStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      Swal.fire('Error', 'Failed to load submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (submission, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/getinvolved/${submission._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        Swal.fire('Updated!', `Application marked as ${status}`, 'success');
        fetchSubmissions();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (submission) => {
    const result = await Swal.fire({
      title: 'Delete Application?',
      text: `Are you sure you want to delete ${submission.fullName}'s application?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`http://localhost:5000/api/getinvolved/${submission._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Application has been deleted.', 'success');
        fetchSubmissions();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete application', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return { label: 'Pending', color: '#f59e0b', bg: '#fed7aa' };
      case 'contacted': return { label: 'Contacted', color: '#3b82f6', bg: '#dbeafe' };
      case 'approved': return { label: 'Approved', color: '#10b981', bg: '#d1fae5' };
      case 'rejected': return { label: 'Rejected', color: '#ef4444', bg: '#fee2e2' };
      default: return { label: status, color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getInterestIcon = (interest) => {
    switch(interest) {
      case 'Start/Join an RLG Club': return faUsers;
      case 'Become a Mentor': return faEnvelope;
      case 'Volunteer at Events': return faHandsHelping;
      default: return faBuilding;
    }
  };

  const filteredSubmissions = statusFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === statusFilter);

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Get Involved Applications</h1>
      </div>

      {stats && (
        <div className="stats-cards">
          <div className="stat-mini-card">
            <h3>{stats.stats?.find(s => s._id === 'pending')?.count || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-mini-card">
            <h3>{stats.stats?.find(s => s._id === 'contacted')?.count || 0}</h3>
            <p>Contacted</p>
          </div>
          <div className="stat-mini-card">
            <h3>{stats.stats?.find(s => s._id === 'approved')?.count || 0}</h3>
            <p>Approved</p>
          </div>
          <div className="stat-mini-card">
            <h3>{submissions.length}</h3>
            <p>Total</p>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <div className="status-filter">
          <FontAwesomeIcon icon={faTag} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Interest</th>
              <th>District</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => {
              const status = getStatusBadge(submission.status);
              return (
                <tr key={submission._id}>
                  <td><strong>{submission.fullName}</strong></td>
                  <td>{submission.email}</td>
                  <td>
                    <span className="interest-badge">
                      <FontAwesomeIcon icon={getInterestIcon(submission.interest)} /> {submission.interest}
                    </span>
                  </td>
                  <td>{submission.district || '—'}</td>
                  <td>
                    <span className="status-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                  </td>
                  <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="action-btn view" onClick={() => setSelectedSubmission(submission)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {submission.status === 'pending' && (
                      <button className="action-btn contact" onClick={() => handleUpdateStatus(submission, 'contacted')}>
                        <FontAwesomeIcon icon={faPhone} />
                      </button>
                    )}
                    {submission.status === 'contacted' && (
                      <button className="action-btn approve" onClick={() => handleUpdateStatus(submission, 'approved')}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>
                    )}
                    {submission.status !== 'rejected' && submission.status !== 'approved' && (
                      <button className="action-btn reject" onClick={() => handleUpdateStatus(submission, 'rejected')}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </button>
                    )}
                    <button className="action-btn delete" onClick={() => handleDelete(submission)}>
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="close-btn" onClick={() => setSelectedSubmission(null)}>&times;</button>
            </div>
            <div className="submission-details">
              <p><strong>Full Name:</strong> {selectedSubmission.fullName}</p>
              <p><strong>Email:</strong> {selectedSubmission.email}</p>
              <p><strong>Phone:</strong> {selectedSubmission.phone || 'Not provided'}</p>
              <p><strong>Organization/School:</strong> {selectedSubmission.organization || 'Not provided'}</p>
              <p><strong>Interest:</strong> {selectedSubmission.interest}</p>
              <p><strong>District:</strong> {selectedSubmission.district || 'Not provided'}</p>
              <p><strong>Message:</strong> {selectedSubmission.message || 'No message provided'}</p>
              <p><strong>Status:</strong> {selectedSubmission.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
              {selectedSubmission.notes && <p><strong>Notes:</strong> {selectedSubmission.notes}</p>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .stats-cards { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat-mini-card { background: white; border-radius: 12px; padding: 20px; flex: 1; min-width: 120px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-mini-card h3 { font-size: 28px; color: #22c55e; margin-bottom: 5px; }
        .stat-mini-card p { color: #6b7280; font-size: 14px; }
        .filters-bar { margin-bottom: 20px; }
        .status-filter { display: flex; align-items: center; gap: 10px; }
        .status-filter select { padding: 8px 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; }
        .interest-badge { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .action-btn.contact { color: #3b82f6; }
        .action-btn.approve { color: #10b981; }
        .action-btn.reject { color: #ef4444; }
        .submission-details { padding: 20px; }
        .submission-details p { margin-bottom: 10px; }
        .loading { display: flex; justify-content: center; align-items: center; height: 200px; gap: 10px; color: #22c55e; }
        @media (max-width: 768px) { .stats-cards { flex-direction: column; } }
      `}</style>
    </div>
  );
};

export default GetInvolvedManagement;