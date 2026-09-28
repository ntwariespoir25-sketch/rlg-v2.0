const Admin = require('../models/Admin.model');
const User = require('../models/User.model');
const Blog = require('../models/Blog.model');
const Donation = require('../models/Donation.model');
const Contact = require('../models/Contact.model');
const { ApiResponse } = require('../utils/apiResponse');
const { generateToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private/Admin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    return ApiResponse.success(res, admins);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get admin by ID
// @route   GET /api/admin/:id
// @access  Private/Admin
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return ApiResponse.notFound(res, 'Admin not found');
    }
    return ApiResponse.success(res, admin);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Create admin
// @route   POST /api/admin
// @access  Private/SuperAdmin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return ApiResponse.badRequest(res, 'Admin already exists');
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role,
      permissions,
    });

    return ApiResponse.created(res, {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Update admin
// @route   PUT /api/admin/:id
// @access  Private/SuperAdmin
const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return ApiResponse.notFound(res, 'Admin not found');
    }

    const { name, email, role, permissions, phone } = req.body;
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;
    if (phone) admin.phone = phone;

    await admin.save();

    return ApiResponse.success(res, admin, 'Admin updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/SuperAdmin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return ApiResponse.notFound(res, 'Admin not found');
    }

    await admin.deleteOne();
    return ApiResponse.success(res, null, 'Admin deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Update admin status
// @route   PATCH /api/admin/:id/status
// @access  Private/SuperAdmin
const updateAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return ApiResponse.notFound(res, 'Admin not found');
    }

    admin.isActive = req.body.isActive;
    await admin.save();

    return ApiResponse.success(res, admin, 'Status updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingContacts = await Contact.countDocuments({ status: 'new' });

    const stats = {
      totalUsers,
      totalBlogs,
      totalDonations: totalDonations[0]?.total || 0,
      pendingContacts,
    };

    return ApiResponse.success(res, stats);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/SuperAdmin
const getSystemLogs = async (req, res) => {
  // This would typically read from log files
  return ApiResponse.success(res, { message: 'Logs endpoint - implement log reading' });
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminStatus,
  getDashboardStats,
  getSystemLogs,
};