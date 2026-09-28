const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin.model');

const DEFAULT_ADMIN = {
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

const adminSeeder = async () => {
  const credentials = {
    ...DEFAULT_ADMIN,
    email: (process.env.ADMIN_EMAIL || DEFAULT_ADMIN.email).toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN.password,
  };

  const existingAdmin = await Admin.findOne({ email: credentials.email }).select('+password');

  // Pass the plaintext password to the model and let the pre-save hook hash it.
  // Hashing here as well would store bcrypt(bcrypt(plaintext)) and no password
  // could ever verify against it.
  if (existingAdmin) {
    const passwordMatches = await bcrypt.compare(credentials.password, existingAdmin.password);

    if (passwordMatches) {
      console.log(`⚠️  Admin already exists: ${credentials.email} (password unchanged)`);
      return;
    }

    existingAdmin.password = credentials.password;
    existingAdmin.isActive = true;
    await existingAdmin.save();
    console.log(`✅ Existing admin password reset: ${credentials.email}`);
    return;
  }

  const admin = await Admin.create(credentials);
  console.log('✅ Default admin created successfully!');
  console.log(`   Email: ${admin.email}`);
};

module.exports = adminSeeder;
module.exports.DEFAULT_ADMIN = DEFAULT_ADMIN;
