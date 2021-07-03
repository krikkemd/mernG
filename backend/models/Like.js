const { model, Schema } = require('mongoose');

const likeSchema = new Schema({
  username: String,
  createdAt: String,
});

module.exports = model('Like', likeSchema);
