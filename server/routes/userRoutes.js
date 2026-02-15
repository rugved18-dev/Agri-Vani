const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/user/register
 * Register a new user or return existing user
 * 
 * Request Body:
 * {
 *   mobileNumber: String (required, 10-digit Indian format),
 *   language: String (enum: 'en', 'hi', 'mr', default: 'en'),
 *   location: {
 *     latitude: Number (optional),
 *     longitude: Number (optional),
 *     address: String (optional)
 *   }
 * }
 */
router.post('/register', async (req, res) => {
  try {
    const { mobileNumber, language = 'en', location = {} } = req.body;

    // Validation: Check if mobileNumber is provided
    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ mobileNumber });

    if (user) {
      // User exists - return existing user
      return res.status(200).json({
        success: true,
        message: 'User already registered',
        isNewUser: false,
        data: user,
      });
    }

    // User doesn't exist - create new user
    user = await User.create({
      mobileNumber,
      language: language || 'en',
      location: {
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        address: location.address || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      isNewUser: true,
      data: user,
    });

  } catch (error) {
    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this mobile number already exists',
      });
    }

    // Generic error handler
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

module.exports = router;
