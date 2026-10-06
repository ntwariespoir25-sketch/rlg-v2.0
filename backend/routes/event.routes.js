const express = require('express');
const router = express.Router();
const { adminProtect, authorizeFor } = require('../middleware/auth.middleware');
const {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/event.controller');

// Public routes
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEventById);

// Admin only routes
router.use(adminProtect);
router.use(authorizeFor('events'));
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;