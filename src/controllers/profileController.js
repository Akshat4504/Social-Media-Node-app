const User = require('../models/userModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio || "",
      followers: user.followers.length,
      following: user.following.length,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (bio) await User.findByIdAndUpdate(req.user.id, { bio }, { new: true })
    

    if (req.file) {
      const userFolder = path.join(__dirname, '..', 'uploads', 'users', user.email);

      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      // Delete old profile picture if it exists
      if (user.profilePicture) {
        const oldPicturePath = path.join(__dirname, '..', user.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Save new profile picture
      const newImagePath = path.join(userFolder, req.file.filename);
      fs.renameSync(req.file.path, newImagePath);

      user.profilePicture = `/uploads/users/${user.email}/${req.file.filename}`;
    }

    await user.save();
    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error updating profile' });
  }
};


const followUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: 'Email is required' });

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findOne({ email });

    if (!targetUser) return res.status(404).json({ msg: 'User not found' });

    if (currentUser.email === email) {
      return res.status(400).json({ msg: "You can't follow yourself" });
    }

    if (currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ msg: 'You are already following this user' });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ msg: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error following user', error });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: 'Email is required' });

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findOne({ email });

    if (!targetUser) return res.status(404).json({ msg: 'User not found' });

    if (currentUser.email === email) {
      return res.status(400).json({ msg: "You can't unfollow yourself" });
    }

    if (!currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({ msg: 'You are not following this user' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser._id.toString());
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ msg: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error unfollowing user', error });
  }
};


module.exports = { getUserProfile, updateUserProfile, followUser, unfollowUser };
