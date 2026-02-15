const express = require('express');
const { createScan, getMyScans } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware'); // Import the security guard

const router = express.Router();

// Both routes are protected! You must be logged in.
router.post('/', protect, createScan);
router.get('/', protect, getMyScans);

module.exports = router;