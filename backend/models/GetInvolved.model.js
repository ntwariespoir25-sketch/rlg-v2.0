const mongoose = require('mongoose');

const getInvolvedSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
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
  organization: {
    type: String,
    default: '',
  },
  interest: {
    type: String,
    required: [true, 'Interest is required'],
    enum: ['Start/Join an RLG Club', 'Become a Mentor', 'Volunteer at Events', 'Partner My Organization'],
  },
  district: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending',
  },
  contactedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  contactedAt: Date,
  notes: {
    type: String,
    default: '',
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('GetInvolved', getInvolvedSchema);