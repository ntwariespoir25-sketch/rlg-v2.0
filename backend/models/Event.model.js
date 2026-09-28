const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  venue: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    enum: ['physical', 'virtual', 'hybrid'],
    default: 'physical',
  },
  meetingLink: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  spots: {
    type: Number,
    default: 100,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  speakers: [{
    name: String,
    title: String,
    bio: String,
    image: String,
  }],
  agenda: [{
    time: String,
    activity: String,
    speaker: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);