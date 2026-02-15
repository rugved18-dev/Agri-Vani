const express = require('express');
const { getWeather } = require('../controllers/weatherController');

const router = express.Router();

// The route will look like: /api/weather/Pune
router.get('/:city', getWeather);

module.exports = router;