const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const {
  getDashboardStats,
  getRecentActivity,
  getChartData,
  getTopDonors,
  getPopularBlogs,
  getUpcomingEvents,
} = require('../controllers/dashboard.controller');

router.use(adminProtect);

router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/chart-data', getChartData);
router.get('/top-donors', getTopDonors);
router.get('/popular-blogs', getPopularBlogs);
router.get('/upcoming-events', getUpcomingEvents);

module.exports = router;