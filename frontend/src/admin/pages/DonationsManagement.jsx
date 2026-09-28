import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faSpinner, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [donationsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/donations', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/donations/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const donationsData = await donationsRes.json();
      const statsData = await statsRes.json();
      
      setDonations(donationsData.data || []);
      setStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      Swal.fire('Error', 'Failed to load donations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (donation, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/donations/${donation._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        Swal.fire('Updated!', `Donation marked as ${status}`, 'success');
        fetchDonations();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (donation) => {
    const result = await Swal.fire({
      title: 'Delete Donation?',
      text: `Are you sure you want to delete this donation record?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`http://localhost:5000/api/donations/${donation._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Donation record has been deleted.', 'success');
        fetchDonations();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete donation', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return { label: 'Completed', color: '#10b981', bg: '#d1fae5' };
      case 'pending': return { label: 'Pending', color: '#f59e0b', bg: '#fed7aa' };
      case 'failed': return { label: 'Failed', color: '#ef4444', bg: '#fee2e2' };
      default: return { label: status, color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Donations Management</h1>
      </div>

      {stats && (
        <div className="stats-cards">
          <div className="stat-mini-card">
            <h3>${stats.total?.total?.toLocaleString() || 0}</h3>
            <p>Total Donations</p>
          </div>
          <div className="stat-mini-card">
            <h3>{stats.total?.count || 0}</h3>
            <p>Number of Donations</p>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Donor Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => {
              const status = getStatusBadge(donation.status);
              return (
                <tr key={donation._id}>
                  <td><strong>{donation.fullName}</strong></td>
                  <td>{donation.email}</td>
                  <td><strong>${donation.amount}</strong> {donation.currency}</td>
                  <td><span className="badge">{donation.paymentMethod}</span></td>
                  <td><span className="status-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span></td>
                  <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="action-btn view" onClick={() => setSelectedDonation(donation)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {donation.status === 'pending' && (
                      <>
                        <button className="action-btn approve" onClick={() => handleUpdateStatus(donation, 'completed')}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                        <button className="action-btn reject" onClick={() => handleUpdateStatus(donation, 'failed')}>
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      </>
                    )}
                    <button className="action-btn delete" onClick={() => handleDelete(donation)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Donation Details</h2>
              <button className="close-btn" onClick={() => setSelectedDonation(null)}>&times;</button>
            </div>
            <div className="donation-details">
              <p><strong>Donor:</strong> {selectedDonation.fullName}</p>
              <p><strong>Email:</strong> {selectedDonation.email}</p>
              <p><strong>Phone:</strong> {selectedDonation.phone || 'Not provided'}</p>
              <p><strong>Amount:</strong> ${selectedDonation.amount} {selectedDonation.currency}</p>
              <p><strong>Payment Method:</strong> {selectedDonation.paymentMethod}</p>
              <p><strong>Status:</strong> {selectedDonation.status}</p>
              <p><strong>Date:</strong> {new Date(selectedDonation.createdAt).toLocaleString()}</p>
              {selectedDonation.transactionId && <p><strong>Transaction ID:</strong> {selectedDonation.transactionId}</p>}
              {selectedDonation.isMonthly && <p><strong>Monthly Donation:</strong> Yes</p>}
              {selectedDonation.notes && <p><strong>Notes:</strong> {selectedDonation.notes}</p>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .stats-cards { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-mini-card { background: white; border-radius: 12px; padding: 20px; flex: 1; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-mini-card h3 { font-size: 28px; color: #22c55e; margin-bottom: 5px; }
        .stat-mini-card p { color: #6b7280; font-size: 14px; }
        .action-btn.approve { color: #10b981; }
        .action-btn.reject { color: #ef4444; }
        .donation-details { padding: 20px; }
        .donation-details p { margin-bottom: 10px; }
      `}</style>
    </div>
  );
};

export default DonationsManagement;