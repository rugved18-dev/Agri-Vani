const express = require('express');
const router = express.Router();

/**
 * POST /api/upload
 * 
 * This route now simply acknowledges the image data and returns it back
 * as an "imageUrl" placeholder. The actual AI analysis happens in /api/scans
 * using the base64 data directly — no Cloudinary needed.
 * 
 * Body (JSON): { imageBase64: string, mimeType?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided. Send { imageBase64: "...", mimeType: "image/jpeg" }',
      });
    }

    console.log(`✅ Image received (${Math.round(imageBase64.length * 0.75 / 1024)}KB)`);

    // Return the base64 as a data URI — the scan controller will send this to the AI engine
    const dataUri = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

    res.status(200).json({
      success: true,
      imageUrl: dataUri,       // data URI used by scanController → AI engine
      imageBase64: imageBase64, // raw base64 also included for direct AI use
      message: 'Image ready for analysis',
    });

  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;