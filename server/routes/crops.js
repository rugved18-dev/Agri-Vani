const express = require('express');
const router = express.Router();
const {
  getAllCrops,
  getCropsByFarmer,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

// GET all crops
router.get('/', getAllCrops);

// GET crops by farmer ID
router.get('/farmer/:farmerId', getCropsByFarmer);

// POST create a new crop
router.post('/', createCrop);

// PUT update a crop
router.put('/:id', updateCrop);

// DELETE a crop
router.delete('/:id', deleteCrop);

module.exports = router;
