const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple script to create admin directly
const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rlg_database';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Define Admin Schema directly (in case model doesn't exist yet)
    const adminSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
      permissions: [String],
      phone: String,
      lastLogin: Date,
    }, { timestamps: true });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@rlg.org' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists, updating password...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('✅ Password updated to: admin123');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new Admin({
        name: 'Super Admin',
        email: 'admin@rlg.org',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        permissions: [
          'manage_users', 'manage_blogs', 'manage_programs', 
          'manage_events', 'manage_gallery', 'manage_donations', 
          'manage_testimonials', 'view_analytics'
        ],
        phone: '+250788123456',
      });
      
      await admin.save();
      console.log('✅ Admin created successfully!');
    }
    
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@rlg.org');
    console.log('   Password: admin123');
    console.log('   Role: super_admin');
    
    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();