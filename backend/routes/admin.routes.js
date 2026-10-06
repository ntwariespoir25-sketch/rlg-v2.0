const express = require('express');
const router = express.Router();
const { adminProtect, authorizeFor } = require('../middleware/auth.middleware');
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

// All admin routes require authentication
router.use(adminProtect);

// System — declared before `/:id` so these paths are not captured by it
router.get('/dashboard/stats', getDashboardStats);
router.get('/logs', getSystemLogs);

// Admin management — restricted to admin/super_admin
router.use(authorizeFor('admins'));

router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id/status', updateAdminStatus);

module.exports = router;