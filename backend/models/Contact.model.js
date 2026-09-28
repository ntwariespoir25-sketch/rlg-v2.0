const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['Programs inquiry', 'Partnership request', 'Volunteering', 'Donation', 'General question'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  repliedAt: Date,
  replyMessage: String,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Contact', contactSchema);