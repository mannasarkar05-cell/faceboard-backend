const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPic: { type: String, default: '' },
  text: { type: String, required: true },
  image: { type: String, default: '' },
  likes: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);