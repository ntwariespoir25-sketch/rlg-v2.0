const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { donationLimiter } = require('../middleware/rateLimit.middleware');
const {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonationStatus,
  deleteDonation,
  getDonationStats,
  processMobileMoneyPayment,
  getDonationReceipt,
} = require('../controllers/donation.controller');

// Public route
const donationValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('amount').isNumeric().withMessage('Valid amount is required'),
  body('paymentMethod').isIn(['mobile_money', 'bank_transfer', 'credit_card']),
];
router.post('/', donationLimiter, donationValidation, validate, createDonation);
router.post('/process-momo', donationLimiter, processMobileMoneyPayment);
router.get('/receipt/:id', getDonationReceipt);

// Admin only routes
router.use(adminProtect);

router.get('/', getAllDonations);
router.get('/stats', getDonationStats);
router.get('/:id', getDonationById);
router.patch('/:id/status', updateDonationStatus);
router.delete('/:id', deleteDonation);

module.exports = router;