const express = require('express');
const { getAllPosts, getPostById, createPost, updatePost, deletePost, getMyPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


//Public
router.get('/', getAllPosts);
router.get('/:id', getPostById);

//Protected
router.post('/', protect,createPost);
router.get('/user/myposts', protect, getMyPosts);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);


module.exports = router;