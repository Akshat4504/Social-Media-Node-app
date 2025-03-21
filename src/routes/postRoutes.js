const express = require('express');
const {  createPost,  getAllPosts,  getSinglePost,  updatePost,  deletePost} = require('../controllers/postController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Post Routes
router.post('/new-post', verifyToken, upload.single('image'), createPost);
router.get('/all-post', verifyToken, getAllPosts);
router.get('/:id', verifyToken, getSinglePost);
router.put('/:id', verifyToken, upload.single('image'), updatePost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
