const User = require('../models/User.model');
const { generateToken } = require('../utils/generateToken');
const { sendWelcomeEmail, sendEmail } = require('../utils/sendEmail');
const { ApiResponse } = require('../utils/apiResponse');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, school, district } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return ApiResponse.badRequest(res, 'User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      school,
      district,
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.log('Email error but user created:', emailError.message);
    }

    return ApiResponse.success(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    }, 'User registered successfully', 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.badRequest(res, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return ApiResponse.success(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    }, 'Login successful');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return ApiResponse.success(res, user);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return ApiResponse.success(res, null, 'Logged out successfully');
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ApiResponse.badRequest(res, 'No user found with this email');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">Reset Your Password</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({ email, subject: 'Password Reset Request', html });

    return ApiResponse.success(res, null, 'Password reset email sent');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid or expired token');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return ApiResponse.success(res, null, 'Password reset successful');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, school, district } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (school) user.school = school;
    if (district) user.district = district;

    await user.save();

    return ApiResponse.success(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      school: user.school,
      district: user.district,
    }, 'Profile updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
};