const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

if (!mongoose.models.User) {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true , trim: true },
    email: { type: String, required: true, unique: true , lowercase: true, trim: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String , trim: true  },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });

  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  mongoose.model('User', userSchema);
}

module.exports = mongoose.model('User');
