const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  phone: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1'],
  },
  currency: {
    type: String,
    enum: ['USD', 'RWF'],
    default: 'USD',
  },
  isMonthly: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'bank_transfer', 'credit_card'],
    required: true,
  },
  mobileMoneyNumber: {
    type: String,
    default: '',
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  receiptUrl: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  donorType: {
    type: String,
    enum: ['individual', 'organization'],
    default: 'individual',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', donationSchema);