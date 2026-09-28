const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, resetPassword, updateProfile } = require('../controllers/auth.controller');
const { protect, adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const {
  adminLogin,
  getAdminMe,
  adminLogout,
  adminChangePassword,
} = require('../controllers/admin.controller');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/forgot-password', body('email').isEmail(), validate, forgotPassword);
router.post('/reset-password/:token', body('password').isLength({ min: 6 }), validate, resetPassword);

// Protected user routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);

// Admin login route
router.post('/admin-login', authLimiter, adminLogin);

// Get admin profile (protected)
router.get('/admin-me', adminProtect, getAdminMe);

// Admin logout
router.post('/admin-logout', adminProtect, adminLogout);

// Admin change password
router.put('/admin-change-password', adminProtect, adminChangePassword);

module.exports = router;