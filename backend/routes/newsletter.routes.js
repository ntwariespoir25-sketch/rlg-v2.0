const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const {
  subscribe,
  getAllSubscribers,
  unsubscribe,
  getNewsletterStats,
} = require('../controllers/newsletter.controller');

// Public route - subscribe
router.post('/', subscribe);

// Admin only routes
router.use(adminProtect);

router.get('/', getAllSubscribers);
router.get('/stats', getNewsletterStats);
router.delete('/:id', unsubscribe);

module.exports = router;