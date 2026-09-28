const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  submitGetInvolved,
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
  getSubmissionStats,
} = require('../controllers/getInvolved.controller');

// Validation rules for submission
const submissionValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('interest').isIn(['Start/Join an RLG Club', 'Become a Mentor', 'Volunteer at Events', 'Partner My Organization']),
];

// Public route - Submit form (THIS IS THE IMPORTANT ONE)
router.post('/', submissionValidation, validate, submitGetInvolved);

// Admin only routes
router.use(adminProtect);

router.get('/', getAllSubmissions);
router.get('/stats', getSubmissionStats);
router.get('/:id', getSubmissionById);
router.patch('/:id/status', updateSubmissionStatus);
router.delete('/:id', deleteSubmission);

module.exports = router;