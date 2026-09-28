const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  source: {
    type: String,
    enum: ['footer', 'home', 'blog'],
    default: 'footer',
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Newsletter', newsletterSchema);