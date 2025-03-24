const express = require('express');
const {  createPost, getSinglePost,  updatePost,  deletePost, getAllPosts, getAllPostsOfUser} = require('../controllers/postController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();


// Post Routes

router.post('/new-post', verifyToken, upload.single('image'), createPost);

router.get('/all-user-posts', verifyToken, getAllPostsOfUser);

router.get('/all-posts', verifyToken, getAllPosts);

router.get('/single-post/:postId', verifyToken, getSinglePost);

router.put('/update-post/:postId', verifyToken, upload.single('image'), updatePost);

router.delete('/delete-post/:postId', verifyToken, deletePost);

module.exports = router;
