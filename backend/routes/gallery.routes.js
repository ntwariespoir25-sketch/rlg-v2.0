const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const {
  getAllImages,
  getImageById,
  uploadImage,
  updateImage,
  deleteImage,
  likeImage,
  getImagesByCategory,
  getFeaturedImages,
} = require('../controllers/gallery.controller');

// Public routes
router.get('/', getAllImages);
router.get('/featured', getFeaturedImages);
router.get('/category/:category', getImagesByCategory);
router.get('/:id', getImageById);
router.post('/:id/like', likeImage);

// Admin only routes
router.use(adminProtect);

router.post('/', handleUpload('image', 1), uploadImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;