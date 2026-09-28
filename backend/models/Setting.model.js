const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    default: 'string',
  },
  description: {
    type: String,
    default: '',
  },
  group: {
    type: String,
    enum: ['general', 'social', 'contact', 'seo', 'api', 'notification'],
    default: 'general',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Setting', settingSchema);