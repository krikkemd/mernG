const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: { type: String, maxLength: [3000, 'a post can only have 3000 characters'] },
  username: 'string',
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  avatar: 'string',
  createdAt: 'string',
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // array
  likes: [
    {
      // id: Schema.Types.ObjectId,
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

postSchema.pre(/^find/, function (next) {
  console.log('pre find post -> populate comments');
  this.populate({
    path: 'comments',
    select: 'post username body createdAt',
  });
  // .populate({
  //   path: 'users',
  //   select: 'userId',
  // });
  next();
});

module.exports = model('Post', postSchema);
