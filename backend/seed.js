/**
 * Full database reset & seed script
 * ----------------------------------
 * ⚠️ DANGER: This DELETES ALL DATA in the connected database.
 *
 * Usage:
 *   node seed.js              -> prompts for confirmation
 *   node seed.js --force      -> skips confirmation (use in CI/dev only)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// ---------- Load models ----------
const Admin        = require('./models/Admin.model');
// Uncomment the models you actually have:
// const User         = require('./models/User.model');
// const Blog         = require('./models/Blog.model');
// const Program      = require('./models/Program.model');
// const Event        = require('./models/Event.model');
// const Gallery      = require('./models/Gallery.model');
// const Donation     = require('./models/Donation.model');
// const Testimonial  = require('./models/Testimonial.model');

// ---------- Config ----------
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

const DEFAULT_ADMIN = {
  name:     process.env.ADMIN_NAME     || 'Super Admin',
  email:    process.env.ADMIN_EMAIL    || 'admin@rlg.org',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role:     'super_admin',
  isActive: true,
  phone:    process.env.ADMIN_PHONE    || '+250788123456',
  permissions: [
    'manage_users',
    'manage_blogs',
    'manage_programs',
    'manage_events',
    'manage_gallery',
    'manage_donations',
    'manage_testimonials',
    'view_analytics',
  ],
};

// ---------- Helpers ----------
const ask = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });

const confirm = async () => {
  if (process.argv.includes('--force')) return true;
  const answer = await ask(
    `\n⚠️  This will DELETE ALL DATA in:\n   ${MONGO_URI}\n\nType "yes" to continue: `
  );
  return answer === 'yes';
};

// ---------- Main ----------
const seed = async () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not set in .env');
    process.exit(1);
  }

  const proceed = await confirm();
  if (!proceed) {
    console.log('🚫 Aborted.');
    process.exit(0);
  }

  try {
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected:', mongoose.connection.name);

    // ---------- 1. Wipe collections ----------
    console.log('\n🗑️  Clearing collections...');

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const { name } of collections) {
      await mongoose.connection.db.collection(name).deleteMany({});
      console.log(`   • Cleared: ${name}`);
    }

    // Reset auto-increment counters if you use them elsewhere, e.g.:
    // await Counter.deleteMany({});

    // ---------- 2. Seed default admin ----------
    console.log('\n👤 Creating default admin...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);

    const admin = await Admin.create({
      ...DEFAULT_ADMIN,
      password: hashedPassword,
    });

    console.log('✅ Admin created');
    console.log('──────────────────────────────');
    console.log('   Email    :', admin.email);
    console.log('   Password :', DEFAULT_ADMIN.password);
    console.log('   Role     :', admin.role);
    console.log('──────────────────────────────');
    console.log('⚠️  Change this password after first login!\n');

    // ---------- 3. (Optional) Seed other collections ----------
    // await Program.create({ ... });
    // await Blog.create({ ... });

    console.log('🎉 Seeding complete.\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    console.error(err.stack);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

seed();