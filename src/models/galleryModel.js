const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [
        {
            imagePath: { type: String, required: true }
        }
    ],
    description: { type: String, default: '' }, // Single description for the entire gallery
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);
