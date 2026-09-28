const express = require('express');
const router = express.Router();
const { adminProtect, authorize } = require('../middleware/auth.middleware');
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminStatus,
  getDashboardStats,
  getSystemLogs,
} = require('../controllers/admin.controller');

// All admin routes require authentication and admin role
router.use(adminProtect);
router.use(authorize('admin', 'super_admin'));

// Admin management
router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id/status', updateAdminStatus);

// System
router.get('/dashboard/stats', getDashboardStats);
router.get('/logs', getSystemLogs);

module.exports = router;