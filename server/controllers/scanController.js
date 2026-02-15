const Scan = require('../models/scan');
const axios = require('axios');
// @desc    Save a new scan
// @route   POST /api/scans
// @access  Private (Only logged-in farmers can scan)
exports.createScan = async (req, res) => {
  try {
    const { imageUrl, cropName } = req.body;

    // 1. Send the image URL to Python (Port 5002)
    const aiResponse = await axios.post('http://127.0.0.1:5002/predict', {
      imageUrl,
      cropName
    });

    const { disease, confidence, solution } = aiResponse.data;

    // 2. Save the result to MongoDB
    const scan = await Scan.create({
      user: req.user.id,
      imageUrl,
      cropName,
      diseaseName: disease, // Saved from Python!
      confidence: confidence,
      solution: solution
    });

    res.status(201).json({
      success: true,
      data: scan
    });

  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ success: false, message: "AI Engine failed: " + error.message });
  }
};
// @desc    Get all scans for the logged-in user
// @route   GET /api/scans
// @access  Private
exports.getMyScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};