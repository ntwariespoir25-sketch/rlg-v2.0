import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faReply, faTrash, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setContacts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      Swal.fire('Error', 'Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setReplyMessage('');
  };

  const handleMarkAsRead = async (contact) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/contact/${contact._id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchContacts();
      Swal.fire('Marked', 'Message marked as read', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to mark as read', 'error');
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      Swal.fire('Error', 'Please enter a reply message', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/contact/${selectedContact._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyMessage })
      });
      
      if (response.ok) {
        Swal.fire('Sent!', 'Reply has been sent to the user.', 'success');
        setSelectedContact(null);
        fetchContacts();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to send reply', 'error');
    }
  };

  const handleDelete = async (contact) => {
    const result = await Swal.fire({
      title: 'Delete Message?',
      text: `Are you sure you want to delete message from ${contact.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`http://localhost:5000/api/contact/${contact._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Message has been deleted.', 'success');
        fetchContacts();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete message', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new': return { label: 'New', color: '#ef4444', bg: '#fee2e2' };
      case 'read': return { label: 'Read', color: '#f59e0b', bg: '#fed7aa' };
      case 'replied': return { label: 'Replied', color: '#10b981', bg: '#d1fae5' };
      default: return { label: status, color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Contact Messages</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => {
              const status = getStatusBadge(contact.status);
              return (
                <tr key={contact._id}>
                  <td><strong>{contact.name}</strong></td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td><span className="status-badge" style={{ background: status.bg, color: status.color }}>{status.label}</span></td>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="action-btn view" onClick={() => handleView(contact)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {contact.status === 'new' && (
                      <button className="action-btn mark" onClick={() => handleMarkAsRead(contact)}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>
                    )}
                    <button className="action-btn delete" onClick={() => handleDelete(contact)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message from {selectedContact.name}</h2>
              <button className="close-btn" onClick={() => setSelectedContact(null)}>&times;</button>
            </div>
            <div className="message-details">
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Phone:</strong> {selectedContact.phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> {selectedContact.subject}</p>
              <p><strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</p>
              <div className="message-content">
                <strong>Message:</strong>
                <p>{selectedContact.message}</p>
              </div>
            </div>
            <div className="reply-section">
              <label>Reply to {selectedContact.name}:</label>
              <textarea rows="4" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply here..." />
              <button className="btn-primary" onClick={handleReply}>
                <FontAwesomeIcon icon={faReply} /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .message-details { padding: 20px; border-bottom: 1px solid #e5e7eb; }
        .message-details p { margin-bottom: 10px; }
        .message-content { margin-top: 15px; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .reply-section { padding: 20px; }
        .reply-section label { display: block; margin-bottom: 10px; font-weight: 500; }
        .reply-section textarea { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 15px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default ContactsManagement;