// Convenience entry point: runs the real seeders so admin credentials are
// always created through the Admin model (which hashes the password).
// Kept separate from the default Admin document in seeders/admin.seeder.js.
const mongoose = require('mongoose');
require('dotenv').config();
const adminSeeder = require('./seeders/admin.seeder');
const editorSeeder = require('./seeders/editor.seeder');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    await adminSeeder();
    await editorSeeder();

    console.log('\n📋 Admin login:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@rlg.org'}`);
    console.log('   Password: (see ADMIN_PASSWORD in backend/.env)');
    console.log('\n📋 Editor login (content only, no donations/settings):');
    console.log(`   Email: ${process.env.EDITOR_EMAIL || 'editor@rlg.org'}`);
    console.log('   Password: (see EDITOR_PASSWORD in backend/.env)');

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
