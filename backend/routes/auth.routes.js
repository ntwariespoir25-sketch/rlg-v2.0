const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, resetPassword, updateProfile } = require('../controllers/auth.controller');
const { protect, adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const Admin = require('../models/Admin.model');
const { generateToken } = require('../utils/generateToken');

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

// Admin login route with debugging
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=========================================');
    console.log('Admin Login Attempt:');
    console.log('Email:', email);
    console.log('Password received:', password ? 'Yes' : 'No');
    console.log('=========================================');
    
    // Find admin
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    console.log('✅ Admin found:', admin.name);
    console.log('Admin role:', admin.role);
    console.log('Admin active:', admin.isActive);
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate token
    const token = generateToken(admin._id, admin.role);
    
    console.log('✅ Login successful!');
    console.log('Token generated:', token ? 'Yes' : 'No');
    console.log('=========================================');
    
    res.json({
      success: true,
      data: {
        token,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});
// Get admin profile (protected)
router.get('/admin-me', adminProtect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin logout
router.post('/admin-logout', adminProtect, async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin change password
router.put('/admin-change-password', adminProtect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');
    
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;