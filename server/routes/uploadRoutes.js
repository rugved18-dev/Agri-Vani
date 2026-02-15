const express = require('express');
const upload = require('../config/cloudinary'); // Import the config we just made
const router = express.Router();

// Route: POST /api/upload
// "image" is the key name we will use in Postman
router.post('/', upload.single('image'), (req, res) => {
  try {
    // If upload is successful, Cloudinary gives us a URL
    res.status(200).json({
      success: true,
      imageUrl: req.file.path, // <--- THIS is what we save to MongoDB later
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;