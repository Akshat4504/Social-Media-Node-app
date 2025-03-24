const express = require('express');
const { getUserProfile, updateUserProfile, followUser, unfollowUser} = require('../controllers/profileController');
const upload = require('../middlewares/uploadMiddleware');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Profile Routes
router.get('/view-profile', verifyToken, getUserProfile);
router.put('/update-profile', verifyToken, upload.single('profilePicture'), updateUserProfile);
router.post('/follow', verifyToken, followUser);
router.post('/unfollow', verifyToken, unfollowUser);

module.exports = router;
