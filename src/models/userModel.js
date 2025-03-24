const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

if (!mongoose.models.User) {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    previousPasswords: [{ type: String }], // Store previous 3 passwords
    profilePicture: { type: String },
    bio: { type: String, trim: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });

  // Password comparison
  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Validate password format
  userSchema.statics.validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  mongoose.model('User', userSchema);
}

module.exports = mongoose.model('User');
