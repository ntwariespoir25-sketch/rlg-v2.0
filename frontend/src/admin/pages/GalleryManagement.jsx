import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSpinner, faImage, faUpload } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'School Leadership Bootcamps',
    location: 'Kigali, Rwanda',
    photographer: 'RLG Media Team',
    imageFile: null
  });

  const categories = [
    'School Leadership Bootcamps',
    'Light the Flame Debates',
    'RLG Green Life',
    'Leadership Forums',
    'Oasis of Wealth Awards'
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/gallery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setImages(data.data || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      Swal.fire('Error', 'Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Image must be less than 5MB', 'error');
        return;
      }
      setFormData({ ...formData, imageFile: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageFile && !formData.title) {
      Swal.fire('Error', 'Please fill in title and select an image', 'error');
      return;
    }
    
    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('photographer', formData.photographer);
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      
      const response = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });
      
      if (response.ok) {
        Swal.fire('Success', 'Image uploaded successfully!', 'success');
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          category: 'School Leadership Bootcamps',
          location: 'Kigali, Rwanda',
          photographer: 'RLG Media Team',
          imageFile: null
        });
        fetchImages();
      } else {
        Swal.fire('Error', 'Failed to upload image', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image) => {
    const result = await Swal.fire({
      title: 'Delete Image?',
      text: `Are you sure you want to delete "${image.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/gallery/${image._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          Swal.fire('Deleted!', 'Image has been deleted.', 'success');
          fetchImages();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete image', 'error');
      }
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Gallery Management</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Upload Image
        </button>
      </div>

      <div className="gallery-grid">
        {images.map(image => (
          <div key={image._id} className="gallery-item">
            <div className="gallery-image">
              <FontAwesomeIcon icon={faImage} size="3x" />
            </div>
            <div className="gallery-info">
              <h4>{image.title}</h4>
              <p>{image.category}</p>
              <button className="delete-btn" onClick={() => handleDelete(image)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload New Image</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Photographer</label>
                <input type="text" value={formData.photographer} onChange={(e) => setFormData({...formData, photographer: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Image File *</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={handleFileChange} required={!formData.imageFile} />
                  <FontAwesomeIcon icon={faUpload} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? <><FontAwesomeIcon icon={faSpinner} spin /> Uploading...</> : <><FontAwesomeIcon icon={faUpload} /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 20px; }
        .gallery-item { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
        .gallery-item:hover { transform: translateY(-5px); }
        .gallery-image { height: 180px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; }
        .gallery-info { padding: 12px; position: relative; }
        .gallery-info h4 { font-size: 14px; margin-bottom: 4px; }
        .gallery-info p { font-size: 12px; color: #6b7280; }
        .delete-btn { position: absolute; top: 12px; right: 12px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; }
        .file-upload { display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px dashed #e5e7eb; border-radius: 8px; cursor: pointer; }
        @media (max-width: 1024px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .gallery-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default GalleryManagement;