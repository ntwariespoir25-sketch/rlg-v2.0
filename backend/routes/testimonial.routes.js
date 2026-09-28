const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  getAllTestimonials,
  getApprovedTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  featureTestimonial,
} = require('../controllers/testimonial.controller');

// Public routes
router.get('/', getApprovedTestimonials);
router.get('/all', getAllTestimonials);
router.get('/:id', getTestimonialById);

const testimonialValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('content').notEmpty().withMessage('Testimonial content is required'),
];
router.post('/', testimonialValidation, validate, createTestimonial);

// Admin only routes
router.use(adminProtect);

router.put('/:id', testimonialValidation, validate, updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/approve', approveTestimonial);
router.patch('/:id/feature', featureTestimonial);

module.exports = router;