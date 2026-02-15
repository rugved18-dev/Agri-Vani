const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: [true, 'Please provide a mobile number'],
      unique: true,
      match: [
        /^[6-9]\d{9}$/,
        'Please provide a valid 10-digit Indian mobile number',
      ],
    },
    // --- NEW: Password Field (Crucial for Login) ---
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Don't return password in query results by default
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'mr'],
      default: 'en',
    },
    // --- UPDATED: Structured Location for APIs ---
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      district: { type: String, default: null }, // Needed for Market Price API
      state: { type: String, default: null },    // Needed for filtering
      address: { type: String, default: null },
    },
    // --- NEW: Crops Array (For Personalization) ---
    crops: [{
      type: String,
      enum: ['Cotton', 'Soybean', 'Wheat', 'Rice', 'Tomato', 'Onion', 'Sugarcane', 'Other'],
      default: []
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default Farmer Icon
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'expert'],
      default: 'user'
    }
  },
  { 
    timestamps: true,
    collection: 'users'
  }
);

// --- 1. Encrypt Password using Bcrypt before saving ---
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- 2. Method to Generate JWT Token (Keeps Controller Clean) ---
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- 3. Method to Compare Entered Password with Hashed Password ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for faster queries
UserSchema.index({ mobileNumber: 1 });

module.exports = mongoose.model('User', UserSchema);