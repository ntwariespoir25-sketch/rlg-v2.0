const Gallery = require('../models/Gallery.model');
const { ApiResponse } = require('../utils/apiResponse');

const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find({ status: 'active' }).sort({ createdAt: -1 });
    return ApiResponse.success(res, images);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return ApiResponse.notFound(res, 'Image not found');
    return ApiResponse.success(res, image);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const uploadImage = async (req, res) => {
  try {
    // For now, create a placeholder entry
    // In production, upload to Cloudinary first
    const image = await Gallery.create({
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      publicId: req.file?.filename || '',
    });
    return ApiResponse.created(res, image);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return ApiResponse.notFound(res, 'Image not found');
    return ApiResponse.success(res, image);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return ApiResponse.notFound(res, 'Image not found');
    await image.deleteOne();
    return ApiResponse.success(res, null, 'Image deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const likeImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return ApiResponse.notFound(res, 'Image not found');
    image.likes += 1;
    await image.save();
    return ApiResponse.success(res, { likes: image.likes });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getImagesByCategory = async (req, res) => {
  try {
    const images = await Gallery.find({ category: req.params.category, status: 'active' });
    return ApiResponse.success(res, images);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getFeaturedImages = async (req, res) => {
  try {
    const images = await Gallery.find({ isFeatured: true, status: 'active' }).limit(6);
    return ApiResponse.success(res, images);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getAllImages,
  getImageById,
  uploadImage,
  updateImage,
  deleteImage,
  likeImage,
  getImagesByCategory,
  getFeaturedImages,
};