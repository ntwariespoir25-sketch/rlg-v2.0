const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { uploadFile, deleteFile, uploadMultiple } = require('../controllers/upload.controller');

router.use(adminProtect);

router.post('/single', handleUpload('file', 1), uploadFile);
router.post('/multiple', handleUpload('files', 10), uploadMultiple);
router.delete('/:publicId', deleteFile);

module.exports = router;