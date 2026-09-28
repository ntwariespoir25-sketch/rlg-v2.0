const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  archiveBlog,
  likeBlog,
  addView,
  getBlogsByCategory,
  getBlogStats,
} = require('../controllers/blog.controller');

// Public routes
router.get('/', getAllBlogs);
router.get('/stats', getBlogStats);
router.get('/category/:category', getBlogsByCategory);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);
router.post('/:id/like', likeBlog);
router.post('/:id/view', addView);

// Admin only routes
router.use(adminProtect);

const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('category').isIn(['Leadership Tips', 'Events', 'Student Stories', 'Partnerships', 'Announcements', 'Programs']),
];

router.post('/', blogValidation, validate, createBlog);
router.put('/:id', blogValidation, validate, updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/publish', publishBlog);
router.patch('/:id/archive', archiveBlog);

module.exports = router;