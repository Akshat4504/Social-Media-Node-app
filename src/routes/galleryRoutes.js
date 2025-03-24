const express = require('express');
const { createGallery, deleteGallery, viewGallery} = require('../controllers/galleryController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/create', verifyToken, upload.array('images', 10), createGallery);
router.delete('/delete', verifyToken, deleteGallery);
router.get('/view', verifyToken, viewGallery);


module.exports = router;
