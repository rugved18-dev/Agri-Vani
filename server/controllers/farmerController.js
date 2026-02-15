// Controller for Farmer-related operations

// Get all farmers
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await require('../models/Farmer').find();
    res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single farmer by ID
exports.getFarmerById = async (req, res) => {
  try {
    const farmer = await require('../models/Farmer').findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }
    res.status(200).json({
      success: true,
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new farmer
exports.createFarmer = async (req, res) => {
  try {
    const Farmer = require('../models/Farmer');
    const farmer = await Farmer.create(req.body);
    res.status(201).json({
      success: true,
      data: farmer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update farmer
exports.updateFarmer = async (req, res) => {
  try {
    const Farmer = require('../models/Farmer');
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }
    res.status(200).json({
      success: true,
      data: farmer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete farmer
exports.deleteFarmer = async (req, res) => {
  try {
    const Farmer = require('../models/Farmer');
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Farmer deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
