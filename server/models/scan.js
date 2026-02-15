const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this scan to a specific Farmer
    required: true
  },
  imageUrl: {
    type: String,
    required: true // The Cloudinary URL you just got!
  },
  cropName: {
    type: String, // e.g., "Tomato"
    required: true
  },
  diseaseName: {
    type: String,
    default: 'Analyzing...' // Will be updated by AI later
  },
  confidence: {
    type: Number,
    default: 0
  },
  solution: {
    type: String,
    default: 'Pending...'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scan', scanSchema);