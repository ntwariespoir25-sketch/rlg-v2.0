import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner, faEye } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const ProgramsManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'School Leadership Development',
    target: '',
    description: '',
    longDescription: '',
    duration: '',
    spots: '',
    howToJoin: '',
    benefits: '',
    requirements: '',
    isActive: true
  });

  const programTypes = [
    'School Leadership Development',
    'Tournaments & Competitions',
    'Leadership Forums & Conferences'
  ];

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/programs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPrograms(data.data || []);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      Swal.fire('Error', 'Failed to load programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      type: 'School Leadership Development',
      target: '',
      description: '',
      longDescription: '',
      duration: '',
      spots: '',
      howToJoin: '',
      benefits: '',
      requirements: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      type: program.type,
      target: program.target,
      description: program.description,
      longDescription: program.longDescription || '',
      duration: program.duration || '',
      spots: program.spots || '',
      howToJoin: program.howToJoin || '',
      benefits: program.benefits?.join(', ') || '',
      requirements: program.requirements?.join(', ') || '',
      isActive: program.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (program) => {
    const result = await Swal.fire({
      title: 'Delete Program?',
      text: `Are you sure you want to delete "${program.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/programs/${program._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          Swal.fire('Deleted!', 'Program has been deleted.', 'success');
          fetchPrograms();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete program', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const programData = {
        ...formData,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r)
      };
      
      let response;
      if (editingProgram) {
        response = await fetch(`http://localhost:5000/api/programs/${editingProgram._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(programData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/programs', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(programData)
        });
      }
      
      if (response.ok) {
        Swal.fire('Success', `Program ${editingProgram ? 'updated' : 'created'} successfully!`, 'success');
        setShowModal(false);
        fetchPrograms();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save program', 'error');
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Programs Management</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} /> Add New Program
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Target</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(program => (
              <tr key={program._id}>
                <td><strong>{program.title}</strong></td>
                <td><span className="badge">{program.type}</span></td>
                <td>{program.target}</td>
                <td>{program.duration || '—'}</td>
                <td>
                  <span className={`status-badge ${program.isActive ? 'active' : 'inactive'}`}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions">
                  <button className="action-btn edit" onClick={() => handleEdit(program)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(program)}>
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
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProgram ? 'Edit Program' : 'Add New Program'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Program Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    {programTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Target Audience *</label>
                  <input type="text" value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g., 12 Weeks" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Spots Available</label>
                  <input type="text" value={formData.spots} onChange={(e) => setFormData({...formData, spots: e.target.value})} placeholder="e.g., 15 spots left" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Short Description *</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Long Description</label>
                <textarea rows="5" value={formData.longDescription} onChange={(e) => setFormData({...formData, longDescription: e.target.value})} />
              </div>
              <div className="form-group">
                <label>How to Join</label>
                <textarea rows="2" value={formData.howToJoin} onChange={(e) => setFormData({...formData, howToJoin: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Benefits (comma separated)</label>
                  <input type="text" value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} placeholder="Mentorship, Networking, Certificates" />
                </div>
                <div className="form-group">
                  <label>Requirements (comma separated)</label>
                  <input type="text" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} placeholder="Age 16+, Application form" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .modal-content.large { max-width: 900px; width: 95%; }
        .status-badge.active { background: #d1fae5; color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-badge.inactive { background: #fee2e2; color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ProgramsManagement;