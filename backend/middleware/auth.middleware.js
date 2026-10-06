const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Admin = require('../models/Admin.model');
const { SECTION_ROLES } = require('../config/permissions');

// Protect routes for regular users
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Protect routes for admins
const adminProtect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin exists
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    
    if (!admin.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Authorize by explicit role list. Use authorizeFor(section) for
// content/admin sections so the matrix in config/permissions.js stays
// the single source of truth.
const authorize = (...roles) => {
  return (req, res, next) => {
    // adminProtect sets req.admin, protect sets req.user
    const role = req.admin?.role || req.user?.role;

    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
        requiredRoles: roles,
      });
    }
    next();
  };
};

// Gate a route by section name using config/permissions.js
const authorizeFor = (section) => {
  const allowed = SECTION_ROLES[section];
  if (!allowed) {
    // Fail loudly at boot rather than silently locking a section down.
    throw new Error(`authorizeFor: unknown section "${section}" in config/permissions.js`);
  }
  return authorize(...allowed);
};

module.exports = { protect, adminProtect, authorize, authorizeFor };