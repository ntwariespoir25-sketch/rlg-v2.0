const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  submitContact,
  getAllContacts,
  getContactById,
  markAsRead,
  replyToContact,
  deleteContact,
  getContactStats,
} = require('../controllers/contact.controller');

// Public route
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').isIn(['Programs inquiry', 'Partnership request', 'Volunteering', 'Donation', 'General question']),
  body('message').notEmpty().withMessage('Message is required'),
];
router.post('/', contactValidation, validate, submitContact);

// Admin only routes
router.use(adminProtect);

router.get('/', getAllContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.patch('/:id/read', markAsRead);
router.post('/:id/reply', body('reply').notEmpty(), validate, replyToContact);
router.delete('/:id', deleteContact);

module.exports = router;