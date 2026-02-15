const express = require('express');
const router = express.Router();
const {
  getAllFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer,
} = require('../controllers/farmerController');

// GET all farmers
router.get('/', getAllFarmers);

// GET single farmer by ID
router.get('/:id', getFarmerById);

// POST create a new farmer
router.post('/', createFarmer);

// PUT update a farmer
router.put('/:id', updateFarmer);

// DELETE a farmer
router.delete('/:id', deleteFarmer);

module.exports = router;
