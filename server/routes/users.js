const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserByMobileNumber,
  createUser,
  registerUser,
  updateUser,
  deleteUser,
  updateUserLanguage,
} = require('../controllers/userController');

// GET all users
router.get('/', getAllUsers);

// GET user by mobile number
router.get('/:mobileNumber', getUserByMobileNumber);

// POST register new user (for onboarding)
router.post('/register', registerUser);

// POST create a new user
router.post('/', createUser);

// PUT update user language preference
router.put('/language/update', updateUserLanguage);

// PUT update user
router.put('/:id', updateUser);

// DELETE user
router.delete('/:id', deleteUser);

module.exports = router;
