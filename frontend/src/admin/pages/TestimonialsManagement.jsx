import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faStar, faTrash, faSpinner, faEye } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/testimonials/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      Swal.fire('Error', 'Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (testimonial) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/testimonials/${testimonial._id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Swal.fire('Approved!', 'Testimonial has been approved and will appear on the website.', 'success');
      fetchTestimonials();
    } catch (error) {
      Swal.fire('Error', 'Failed to approve testimonial', 'error');
    }
  };

  const handleFeature = async (testimonial) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/testimonials/${testimonial._id}/feature`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isFeatured: !testimonial.isFeatured })
      });
      Swal.fire('Updated!', `Testimonial ${!testimonial.isFeatured ? 'featured' : 'unfeatured'}`, 'success');
      fetchTestimonials();
    } catch (error) {
      Swal.fire('Error', 'Failed to update testimonial', 'error');
    }
  };

  const handleDelete = async (testimonial) => {
    const result = await Swal.fire({
      title: 'Delete Testimonial?',
      text: `Are you sure you want to delete this testimonial?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`http://localhost:5000/api/testimonials/${testimonial._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Testimonial has been deleted.', 'success');
        fetchTestimonials();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete testimonial', 'error');
      }
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Testimonials Management</h1>
      </div>

      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial._id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} style={{ color: i < testimonial.rating ? '#f59e0b' : '#e5e7eb' }} />
                ))}
              </div>
            </div>
            <p className="testimonial-content">"{testimonial.content}"</p>
            <div className="testimonial-actions">
              {!testimonial.isApproved && (
                <button className="action-btn approve" onClick={() => handleApprove(testimonial)}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Approve
                </button>
              )}
              <button className="action-btn feature" onClick={() => handleFeature(testimonial)}>
                <FontAwesomeIcon icon={faStar} /> {testimonial.isFeatured ? 'Unfeature' : 'Feature'}
              </button>
              <button className="action-btn delete" onClick={() => handleDelete(testimonial)}>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
            <div className="testimonial-status">
              {testimonial.isApproved ? (
                <span className="approved"><FontAwesomeIcon icon={faCheckCircle} /> Approved</span>
              ) : (
                <span className="pending"><FontAwesomeIcon icon={faTimesCircle} /> Pending Approval</span>
              )}
              {testimonial.isFeatured && <span className="featured">⭐ Featured</span>}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
        .testimonial-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
        .testimonial-card:hover { transform: translateY(-3px); }
        .testimonial-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
        .testimonial-author strong { display: block; color: #1f2937; }
        .testimonial-author span { font-size: 12px; color: #6b7280; }
        .testimonial-content { color: #4b5563; line-height: 1.6; margin-bottom: 15px; font-style: italic; }
        .testimonial-actions { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .testimonial-actions .action-btn { background: none; border: none; cursor: pointer; padding: 5px 10px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 5px; }
        .testimonial-actions .action-btn.approve { background: #d1fae5; color: #10b981; }
        .testimonial-actions .action-btn.feature { background: #fed7aa; color: #f59e0b; }
        .testimonial-actions .action-btn.delete { background: #fee2e2; color: #ef4444; }
        .testimonial-status { display: flex; gap: 10px; font-size: 12px; }
        .testimonial-status .approved { color: #10b981; }
        .testimonial-status .pending { color: #f59e0b; }
        .testimonial-status .featured { color: #8b5cf6; }
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default TestimonialsManagement;