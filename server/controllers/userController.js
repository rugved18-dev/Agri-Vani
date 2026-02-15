const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user by mobile number
exports.getUserByMobileNumber = async (req, res) => {
  try {
    const user = await User.findOne({ mobileNumber: req.params.mobileNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this mobile number already exists',
      });
    }

    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Register user with mobile number and language
exports.registerUser = async (req, res) => {
  try {
    const { mobileNumber, language, location } = req.body;

    // Validation
    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ mobileNumber });

    if (user) {
      // Update existing user
      user.language = language || user.language;
      if (location) {
        user.location = { ...user.location, ...location };
      }
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    }

    // Create new user
    user = await User.create({
      mobileNumber,
      language: language || 'en',
      location: location || {},
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user language preference
exports.updateUserLanguage = async (req, res) => {
  try {
    const { mobileNumber, language } = req.body;

    if (!mobileNumber || !language) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and language are required',
      });
    }

    const user = await User.findOneAndUpdate(
      { mobileNumber },
      { language },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Language preference updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
