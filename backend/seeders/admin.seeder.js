const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminSeeder = async () => {
  const Admin = require('../models/Admin.model');
  
  // Default admin credentials
  const defaultAdmin = {
    name: 'Super Admin',
    email: 'admin@rlg.org',
    password: 'admin123',
    role: 'super_admin',
    isActive: true,
    permissions: [
      'manage_users', 
      'manage_blogs', 
      'manage_programs', 
      'manage_events', 
      'manage_gallery', 
      'manage_donations', 
      'manage_testimonials', 
      'view_analytics'
    ],
    phone: '+250788123456',
  };
  
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
    
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      defaultAdmin.password = await bcrypt.hash(defaultAdmin.password, salt);
      
      // Create admin
      await Admin.create(defaultAdmin);
      console.log('✅ Default admin created successfully!');
      console.log('   Email: admin@rlg.org');
      console.log('   Password: admin123');
    } else {
      console.log('⚠️ Admin already exists with email: admin@rlg.org');
      console.log('   To reset password, delete the existing admin and re-run seeder');
    }
  } catch (error) {
    console.error('❌ Admin seeder failed:', error.message);
  }
};

module.exports = adminSeeder;