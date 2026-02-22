const Scan = require('../models/scan');
const axios = require('axios');
// @desc    Save a new scan
// @route   POST /api/scans
// @access  Private (Only logged-in farmers can scan)
exports.createScan = async (req, res) => {
  try {
    const { imageUrl, cropName } = req.body;

    // Validate required fields
    if (!imageUrl || !cropName) {
      return res.status(400).json({
        success: false,
        message: 'Image URL and crop name are required'
      });
    }

    // 1. Send the image URL to Python (Port 5002)
    let aiResponse;
    try {
      aiResponse = await axios.post('http://127.0.0.1:5002/predict', {
        imageUrl,
        cropName
      });
    } catch (aiError) {
      console.error("AI Engine Error:", aiError.message);
      return res.status(503).json({
        success: false,
        message: "AI Engine is not available. Please make sure the Python server is running on port 5002"
      });
    }

    const { disease, confidence, solution } = aiResponse.data;

    // 2. Save the result to MongoDB (with fallback if DB is unavailable)
    let scan = {
      user: req.user.id,
      imageUrl,
      cropName,
      diseaseName: disease,
      confidence: confidence,
      solution: solution,
      createdAt: new Date()
    };

    try {
      const scanResult = await Scan.create(scan);
      scan = scanResult;
    } catch (dbError) {
      console.warn('Database save failed, returning scan without database storage:', dbError.message);
      // Still return the scan result even if database save fails (useful for development)
      scan._id = 'temp-' + Date.now();
    }

    res.status(201).json({
      success: true,
      data: scan
    });

  } catch (error) {
    console.error("Scan Creation Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Scan creation failed: " + error.message
    });
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
    console.error('Error fetching scans:', error.message);
    // If database is unavailable, return empty list
    if (error.name === 'MongooseError' || !error.name) {
      console.warn('Database unavailable, returning empty scans list');
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};