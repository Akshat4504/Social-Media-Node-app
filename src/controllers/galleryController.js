const Gallery = require('../models/galleryModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');


// create a gallery
const createGallery = async (req, res) => {
    try {
        const { description } = req.body;
        const files = req.files;

        if (!files || files.length < 3 || files.length > 10) {
            return res.status(500).json({ msg: 'Upload between 3 to 10 images' });
        }

        const user = await User.findById(req.user.id);
        const userFolder = path.join(__dirname, '..', 'uploads', 'users', user.email, 'gallery');

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        const images = files.map((file) => {
            const imagePath = path.join(userFolder, file.filename);
            fs.renameSync(file.path, imagePath);

            return { imagePath: `/uploads/users/${user.email}/gallery/${file.filename}` };
        });

        let gallery = await Gallery.findOne({ user: req.user.id });

        if (gallery) {
            gallery.images.push(...images);
            gallery.description = description;
            await gallery.save();
            return res.status(200).json({ msg: 'Gallery updated successfully', gallery });
        } else {
            gallery = new Gallery({ user: req.user.id, images, description });
            await gallery.save();
            return res.status(201).json({ msg: 'Gallery created successfully', gallery });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error creating or updating gallery' });
    }
};


// Delete images from gallery
const deleteGallery = async (req, res) => {
    try {
        const { imageIds } = req.body;
        const uniqueImageIds = [...new Set(imageIds)];

        const gallery = await Gallery.findOne({ user: req.user.id });
        if (!gallery) return res.status(404).json({ msg: 'Gallery not found' });

        const existingIds = gallery.images.map((img) => img._id.toString());
        const invalidIds = uniqueImageIds.filter(id => !existingIds.includes(id));
        if (invalidIds.length === uniqueImageIds.length) {
            return res.status(400).json({ msg: 'No valid images found for deletion', invalidIds });
        }

        const initialLength = gallery.images.length;

        gallery.images = gallery.images.filter((img) => {
            if (uniqueImageIds.includes(img._id.toString())) {
                const imagePath = path.resolve(__dirname, '..', img.imagePath);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                return false;
            }
            return true;
        });

        if (gallery.images.length === 0) {
            await Gallery.findByIdAndDelete(gallery._id);
            return res.status(200).json({ msg: 'All images deleted. Gallery removed.' });
        }

        await gallery.save();

        const deletedCount = initialLength - gallery.images.length;
        const msg = deletedCount > 0
            ? 'Selected images deleted'
            : 'No valid images found for deletion';

        res.status(200).json({
            msg,
            invalidIds: invalidIds.length ? invalidIds : 'No invalid IDs'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error deleting images' });
    }
};


// View User's Gallery
const viewGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findOne({ user: req.user.id });
        if (!gallery) {
            return res.status(404).json({ msg: 'Gallery not found' });
        }

        res.status(200).json({ gallery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching gallery' });
    }
};


module.exports = { createGallery, deleteGallery, viewGallery };
