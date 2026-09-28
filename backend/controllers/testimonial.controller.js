const Testimonial = require('../models/Testimonial.model');
const { ApiResponse } = require('../utils/apiResponse');

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    return ApiResponse.success(res, testimonials);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ order: 1 });
    return ApiResponse.success(res, testimonials);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
    return ApiResponse.success(res, testimonial);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    return ApiResponse.created(res, testimonial, 'Testimonial submitted for approval');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
    return ApiResponse.success(res, testimonial);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
    await testimonial.deleteOne();
    return ApiResponse.success(res, null, 'Testimonial deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
    testimonial.isApproved = true;
    await testimonial.save();
    return ApiResponse.success(res, testimonial, 'Testimonial approved');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const featureTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return ApiResponse.notFound(res, 'Testimonial not found');
    testimonial.isFeatured = req.body.isFeatured;
    await testimonial.save();
    return ApiResponse.success(res, testimonial);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getAllTestimonials,
  getApprovedTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  featureTestimonial,
};