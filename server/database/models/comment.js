const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  cardId: String,
  username: String,
  body: String,
  rating: { type: Number, default: 0 },
  reported: { type: Boolean, default: false }
}, {
  timestamps: true
});

const comment = mongoose.model('comment', commentSchema);

module.exports = comment;
