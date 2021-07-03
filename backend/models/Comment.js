const { model, Schema } = require('mongoose');
const comments = require('../graphql/resolvers/comments');
const Post = require('./Post');

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  body: String,
  username: String,
  createdAt: String,
});

module.exports = model('Comment', commentSchema);
