const { model, Schema } = require('mongoose');
const comments = require('../graphql/resolvers/comments');
const Post = require('./Post');

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  body: {
    type: String,
    maxLength: [2000, 'a comment can only have 2000 characters'],
  },
  username: String,
  userId: Schema.Types.ObjectId,
  avatar: String,
  createdAt: String,
});

module.exports = model('Comment', commentSchema);
