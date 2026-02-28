const Scan = require('../models/scan');
const axios = require('axios');

// @desc    Save a new scan
// @route   POST /api/scans
// @access  Private
exports.createScan = async (req, res) => {
  try {
    const { imageUrl, imageBase64, cropName } = req.body;

    if (!cropName) {
      return res.status(400).json({ success: false, message: 'Crop name is required' });
    }

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ success: false, message: 'Image URL or base64 data is required' });
    }

    // Build the AI request payload — prefer base64 (faster, no download), fallback to URL
    const aiPayload = { cropName };
    if (imageBase64) {
      aiPayload.imageBase64 = imageBase64;
      console.log('🤖 Sending base64 image to AI engine...');
    } else {
      aiPayload.imageUrl = imageUrl;
      console.log('🤖 Sending image URL to AI engine:', imageUrl);
    }

    let aiResponse;
    try {
      aiResponse = await axios.post('http://127.0.0.1:5002/predict', aiPayload, {
        timeout: 60000,
      });
    } catch (aiError) {
      // Only treat it as "AI Engine unavailable" if the connection itself failed
      if (aiError.code === 'ECONNREFUSED' || aiError.code === 'ECONNRESET' || aiError.code === 'ENOTFOUND' || !aiError.response) {
        console.error('AI Engine connection failed:', aiError.message);
        return res.status(503).json({
          success: false,
          message: 'AI Engine is not available. Make sure the Python server is running on port 5002.',
        });
      }
      // Python returned an HTTP error (e.g. 500 bad image) — pass the message through
      const aiMsg = aiError.response?.data?.error || aiError.message;
      console.error('AI Engine returned error:', aiMsg);
      return res.status(422).json({
        success: false,
        message: `AI analysis failed: ${aiMsg}`,
      });
    }

    const { disease, confidence, solution } = aiResponse.data;

    // Save result to MongoDB
    let scan = {
      user: req.user.id,
      imageUrl: imageUrl || 'base64-image', // don't store full base64 in DB
      cropName,
      diseaseName: disease,
      confidence,
      solution,
      createdAt: new Date(),
    };

    try {
      const scanResult = await Scan.create(scan);
      scan = scanResult;
    } catch (dbError) {
      console.warn('DB save failed, returning result without database storage:', dbError.message);
      scan._id = 'temp-' + Date.now();
    }

    res.status(201).json({ success: true, data: scan });

  } catch (error) {
    console.error('Scan Creation Error:', error.message);
    res.status(500).json({ success: false, message: 'Scan creation failed: ' + error.message });
  }
};

// @desc    Get all scans for the logged-in user
// @route   GET /api/scans
// @access  Private
exports.getMyScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: scans.length, data: scans });
  } catch (error) {
    console.error('Error fetching scans:', error.message);
    res.status(200).json({ success: true, count: 0, data: [] });
  }
};