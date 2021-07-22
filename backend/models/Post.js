const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: 'string',
  username: 'string',
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
  next();
});

module.exports = model('Post', postSchema);
