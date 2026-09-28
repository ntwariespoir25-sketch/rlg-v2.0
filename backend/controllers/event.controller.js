const Event = require('../models/Event.model');
const { ApiResponse } = require('../utils/apiResponse');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return ApiResponse.success(res, events);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'upcoming', date: { $gte: new Date() } }).sort({ date: 1 });
    return ApiResponse.success(res, events);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return ApiResponse.notFound(res, 'Event not found');
    return ApiResponse.success(res, event);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    return ApiResponse.created(res, event);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return ApiResponse.notFound(res, 'Event not found');
    return ApiResponse.success(res, event);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return ApiResponse.notFound(res, 'Event not found');
    await event.deleteOne();
    return ApiResponse.success(res, null, 'Event deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};