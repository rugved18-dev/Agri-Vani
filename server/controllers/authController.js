const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, mobileNumber, password, language, location, crops } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ mobileNumber });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 2. Create user
    const user = await User.create({
      name,
      mobileNumber,
      password,
      language,
      location,
      crops
    });

    // 3. Generate Token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        language: user.language
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // 1. Validate inputs
    if (!mobileNumber || !password) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number and password' });
    }

    // 2. Check for user (Explicitly select password)
    const user = await User.findOne({ mobileNumber }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Handle legacy accounts with no password stored
    if (!user.password) {
      console.log(`⚠️ No password for user ${mobileNumber} — setting mobile number as password`);
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save({ validateBeforeSave: false });
    }

    // 4. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 5. Generate Token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        language: user.language
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is available because of the 'protect' middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};