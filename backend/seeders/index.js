const mongoose = require('mongoose');
require('dotenv').config();
const adminSeeder = require('./admin.seeder');
const editorSeeder = require('./editor.seeder');
const blogSeeder = require('./blog.seeder');
const programSeeder = require('./program.seeder');

const runSeeders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    
    await adminSeeder();
    await editorSeeder();
    await blogSeeder();
    await programSeeder();
    
    console.log('✅ All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

runSeeders();