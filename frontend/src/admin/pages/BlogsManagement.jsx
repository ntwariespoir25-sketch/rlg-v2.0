import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faEye, faSearch, faFilter,
  faCheckCircle, faTimesCircle, faSpinner, faImage,
  faTag, faCalendar, faUser, faEye as faView
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Leadership Tips',
    tags: '',
    featuredImage: '',
    status: 'draft'
  });

  const categories = ['Leadership Tips', 'Events', 'Student Stories', 'Partnerships', 'Announcements', 'Programs'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/blogs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBlogs(data.data?.blogs || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load blogs' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Leadership Tips',
      tags: '',
      featuredImage: '',
      status: 'draft'
    });
    setShowModal(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      featuredImage: blog.featuredImage || '',
      status: blog.status
    });
    setShowModal(true);
  };

  const handleDelete = async (blog) => {
    const result = await Swal.fire({
      title: 'Delete Blog?',
      text: `Are you sure you want to delete "${blog.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#22c55e',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/blogs/${blog._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
          fetchBlogs();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete blog', 'error');
      }
    }
  };

  const handlePublish = async (blog) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/blogs/${blog._id}/publish`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        Swal.fire('Published!', 'Blog has been published.', 'success');
        fetchBlogs();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to publish blog', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };
      
      let response;
      if (editingBlog) {
        response = await fetch(`http://localhost:5000/api/blogs/${editingBlog._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(blogData)
        });
      } else {
        response = await fetch('http://localhost:5000/api/blogs', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(blogData)
        });
      }
      
      if (response.ok) {
        Swal.fire('Success', `Blog ${editingBlog ? 'updated' : 'created'} successfully!`, 'success');
        setShowModal(false);
        fetchBlogs();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save blog', 'error');
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    (selectedCategory === 'All' || blog.category === selectedCategory) &&
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Blogs Management</h1>
        <button className="btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} /> Create New Blog
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input 
            type="text" 
            placeholder="Search blogs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <FontAwesomeIcon icon={faFilter} />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map(blog => (
              <tr key={blog._id}>
                <td><strong>{blog.title}</strong></td>
                <td><span className="badge">{blog.category}</span></td>
                <td>
                  <span className={`status-badge ${blog.status}`}>
                    {blog.status === 'published' ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />}
                    {blog.status}
                  </span>
                </td>
                <td>{blog.views || 0}</td>
                <td>{blog.likes || 0}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="action-btn view" onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="action-btn edit" onClick={() => handleEdit(blog)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  {blog.status !== 'published' && (
                    <button className="action-btn publish" onClick={() => handlePublish(blog)}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                  )}
                  <button className="action-btn delete" onClick={() => handleDelete(blog)}>
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
              <h2>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Excerpt *</label>
                <textarea rows="3" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea rows="8" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="leadership, mentorship, growth" />
              </div>
              <div className="form-group">
                <label>Featured Image URL</label>
                <input type="text" value={formData.featuredImage} onChange={(e) => setFormData({...formData, featuredImage: e.target.value})} placeholder="https://..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Blog</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .management-page {
          padding: 20px;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .page-header h1 { font-size: 24px; color: #1f2937; }
        .btn-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .filters-bar {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
        }
        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          padding: 8px;
        }
        .category-filter select {
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
        }
        .table-container { overflow-x: auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .data-table th { background: #f9fafb; font-weight: 600; }
        .data-table tr:hover { background: #f9fafb; }
        .badge { background: #dcfce7; color: #14532d; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-badge.published { background: #d1fae5; color: #10b981; }
        .status-badge.draft { background: #fee2e2; color: #ef4444; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .action-btn { background: none; border: none; cursor: pointer; padding: 5px; border-radius: 4px; transition: all 0.3s ease; }
        .action-btn.view { color: #3b82f6; }
        .action-btn.edit { color: #f59e0b; }
        .action-btn.publish { color: #10b981; }
        .action-btn.delete { color: #ef4444; }
        .action-btn:hover { transform: scale(1.1); }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 12px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #e5e7eb; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
        .modal-footer { padding: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 10px; }
        .form-group { margin-bottom: 15px; padding: 0 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .loading { display: flex; justify-content: center; align-items: center; height: 400px; gap: 10px; color: #22c55e; }
        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: stretch; }
          .filters-bar { flex-direction: column; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default BlogsManagement;