const { ApiResponse } = require('../utils/apiResponse');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'No file uploaded');
    }
    return ApiResponse.success(res, {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
    }, 'File uploaded successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return ApiResponse.badRequest(res, 'No files uploaded');
    }
    const files = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size,
    }));
    return ApiResponse.success(res, files, 'Files uploaded successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteFile = async (req, res) => {
  try {
    // In production, delete from Cloudinary or filesystem
    return ApiResponse.success(res, null, 'File deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = { uploadFile, uploadMultiple, deleteFile };