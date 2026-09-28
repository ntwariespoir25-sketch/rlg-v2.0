const Program = require('../models/Program.model');
const { ApiResponse } = require('../utils/apiResponse');

const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ order: 1 });
    return ApiResponse.success(res, programs);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getProgramBySlug = async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug });
    if (!program) return ApiResponse.notFound(res, 'Program not found');
    return ApiResponse.success(res, program);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return ApiResponse.notFound(res, 'Program not found');
    return ApiResponse.success(res, program);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    return ApiResponse.created(res, program);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return ApiResponse.notFound(res, 'Program not found');
    return ApiResponse.success(res, program);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return ApiResponse.notFound(res, 'Program not found');
    await program.deleteOne();
    return ApiResponse.success(res, null, 'Program deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getProgramsByType = async (req, res) => {
  try {
    const programs = await Program.find({ type: req.params.type, isActive: true });
    return ApiResponse.success(res, programs);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getAllPrograms,
  getProgramBySlug,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getProgramsByType,
};