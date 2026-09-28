const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  publicId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['School Leadership Bootcamps', 'Light the Flame Debates', 'RLG Green Life', 'Leadership Forums', 'Oasis of Wealth Awards'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: 'Kigali, Rwanda',
  },
  photographer: {
    type: String,
    default: 'RLG Media Team',
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Gallery', gallerySchema);