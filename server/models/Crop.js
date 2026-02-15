const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    season: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Summer'],
      required: true,
    },
    yield: {
      type: Number,
      // in tons
    },
    price: {
      type: Number,
      // current market price
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', CropSchema);
