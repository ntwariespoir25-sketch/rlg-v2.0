import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner, faCalendarAlt, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    venue: '',
    mode: 'physical',
    meetingLink: '',
    spots: 100,
    status: 'upcoming'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setEvents(data.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      Swal.fire('Error', 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      venue: '',
      mode: 'physical',
      meetingLink: '',
      spots: 100,
      status: 'upcoming'
    });
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date?.split('T')[0] || '',
      time: event.time || '',
      location: event.location,
      venue: event.venue || '',
      mode: event.mode,
      meetingLink: event.meetingLink || '',
      spots: event.spots,
      status: event.status
    });
    setShowModal(true);
  };

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: 'Delete Event?',
      text: `Are you sure you want to delete "${event.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/events/${event._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          Swal.fire('Deleted!', 'Event has been deleted.', 'success');
          fetchEvents();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete event', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      
      let response;
      if (editingEvent) {
        response = await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }
      
      if (response.ok) {
        Swal.fire('Success', `Event ${editingEvent ? 'updated' : 'created'} successfully!`, 'success');
        setShowModal(false);
        fetchEvents();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save event', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return '#f59e0b';
      case 'ongoing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Events Management</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} /> Create Event
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Mode</th>
              <th>Spots</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td><strong>{event.title}</strong></td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td><span className="badge">{event.mode}</span></td>
                <td>{event.spots - (event.registeredCount || 0)} left</td>
                <td>
                  <span className="status-badge" style={{ background: `${getStatusColor(event.status)}15`, color: getStatusColor(event.status) }}>
                    {event.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="action-btn edit" onClick={() => handleEdit(event)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(event)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mode</label>
                  <select value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})}>
                    <option value="physical">Physical</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Total Spots</label>
                  <input type="number" value={formData.spots} onChange={(e) => setFormData({...formData, spots: parseInt(e.target.value)})} />
                </div>
              </div>
              {formData.mode !== 'physical' && (
                <div className="form-group">
                  <label>Meeting Link</label>
                  <input type="url" value={formData.meetingLink} onChange={(e) => setFormData({...formData, meetingLink: e.target.value})} placeholder="https://zoom.us/..." />
                </div>
              )}
              <div className="form-group">
                <label>Description *</label>
                <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .badge { background: #dcfce7; color: #14532d; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize; }
      `}</style>
    </div>
  );
};

export default EventsManagement;