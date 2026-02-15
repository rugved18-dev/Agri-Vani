// Controller for Crop-related operations

// Get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const crops = await Crop.find().populate('farmerId', 'name location');
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get crops by farmer ID
exports.getCropsByFarmer = async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const crops = await Crop.find({ farmerId: req.params.farmerId });
    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new crop
exports.createCrop = async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const crop = await Crop.create(req.body);
    res.status(201).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update crop
exports.updateCrop = async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }
    res.status(200).json({
      success: true,
      data: crop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete crop
exports.deleteCrop = async (req, res) => {
  try {
    const Crop = require('../models/Crop');
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
