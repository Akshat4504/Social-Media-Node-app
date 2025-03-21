const express = require('express');
const { register, login, forgotPassword, resetPassword, changePassword } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');
const verifyToken = require('../middlewares/authMiddleware');



const router = express.Router();

// Auth Routes
router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', verifyToken, changePassword);

module.exports = router;
