const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

//Public 
router.get('/', getAllUsers);

//Protected - must be logged in
router.post('/', protect, createUser);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

//Admin only 
router.delete('/:id', protect, adminOnly,deleteUser);

module.exports = router;