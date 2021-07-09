const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  username: String,
  body: String,
  rating: { type: Number, default: 0 },
  reported: { type: Boolean, default: false }
}, {
  timestamps: true
});

const CardSchema = mongoose.Schema({
  image: String,
  username: String,
  description: String,
  comments: [CommentSchema],
  rating: { type: Number, default: 0 },
  reported: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Card = mongoose.model('card', CardSchema);

module.exports = Card;
