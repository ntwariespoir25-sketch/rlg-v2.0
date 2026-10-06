const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin.model');

/**
 * Optional demo/editor account used to verify role-based access control.
 *
 * The Editor role may author content (blogs, programs, events, gallery,
 * testimonials) and read inboxes, but is denied donations, settings and
 * staff management. See config/permissions.js.
 *
 * Configure with EDITOR_EMAIL / EDITOR_PASSWORD in backend/.env.
 */
const DEFAULT_EDITOR = {
  name: 'Content Editor',
  email: 'editor@rlg.org',
  password: 'editor123',
  role: 'editor',
  isActive: true,
  permissions: [
    'manage_blogs',
    'manage_programs',
    'manage_events',
    'manage_gallery',
    'manage_testimonials',
  ],
  phone: '+250788000000',
};

const editorSeeder = async () => {
  const credentials = {
    ...DEFAULT_EDITOR,
    email: (process.env.EDITOR_EMAIL || DEFAULT_EDITOR.email).toLowerCase().trim(),
    password: process.env.EDITOR_PASSWORD || DEFAULT_EDITOR.password,
  };

  const existing = await Admin.findOne({ email: credentials.email }).select('+password');

  // Pass plaintext to the model and let the pre-save hook hash it. Hashing
  // here too would store bcrypt(bcrypt(plaintext)) and nothing could verify.
  if (existing) {
    const passwordMatches = await bcrypt.compare(credentials.password, existing.password);

    if (passwordMatches) {
      console.log(`⚠️  Editor already exists: ${credentials.email} (password unchanged)`);
      return;
    }

    existing.password = credentials.password;
    existing.isActive = true;
    existing.role = 'editor';
    await existing.save();
    console.log(`✅ Existing editor password reset: ${credentials.email}`);
    return;
  }

  const editor = await Admin.create(credentials);
  console.log('✅ Editor created successfully!');
  console.log(`   Email: ${editor.email}`);
  console.log('   Role:  editor (no donations / settings / staff access)');
};

module.exports = editorSeeder;
module.exports.DEFAULT_EDITOR = DEFAULT_EDITOR;
