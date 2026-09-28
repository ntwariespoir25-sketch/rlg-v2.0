const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: [true, 'Program type is required'],
    enum: ['School Leadership Development', 'Tournaments & Competitions', 'Leadership Forums & Conferences'],
  },
  target: {
    type: String,
    required: [true, 'Target audience is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  longDescription: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  spots: {
    type: String,
    default: '',
  },
  subPrograms: [{
    name: String,
    description: String,
    icon: String,
  }],
  howToJoin: {
    type: String,
    default: '',
  },
  benefits: [String],
  requirements: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

programSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Program', programSchema);