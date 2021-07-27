const checkAuth = require('../../util/check-auth');
const { GraphQLUpload } = require('graphql-upload');
const { UserInputError } = require('apollo-server-express');
const User = require('../../models/User');
const path = require('path');
// const fs = require('fs');
const sharp = require('sharp');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

module.exports = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent, { file }, context) => {
      console.log('running singleUpload');

      // check if user is logged in, and get the user id
      const { id } = checkAuth(context);

      try {
        // Find the user in the db with the user's id
        let user = await User.findOne({ _id: id });

        if (!user) return new Error('error uploading file, user not found');

        // await the file
        const { createReadStream, filename, mimetype } = await file;

        // return error when file isnt an image
        if (!mimetype.startsWith('image')) {
          return new UserInputError('file should be an image');
        }

        // Create stream and streamToString to pass to sharp
        const stream = createReadStream();
        const image = await streamToString(stream);

        // Some img extensions
        const extensions = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];

        // replace image extensions with .webp
        let name;
        extensions.map(extension => {
          if (filename.includes(extension)) {
            name = `userId-${Date.now()}-${filename.replace(extension, '.webp')}`;
          }
        });

        // Crop img
        const sharpImage = sharp(image)
          .resize(200, 200)
          .toFormat('webp')
          .webp({ quality: 90 })
          .toFile(path.join(__dirname, `../../public/images/${name}`));

        // Update user avatar inside DB users collection
        user.avatar = `http://localhost:4000/images/${name}`;
        await user.save();

        // update all posts & comment avatars where the post.userId === logged in user._id
        await updateAvatarInPosts(user);
        await updateAvatarInComments(user);

        // Return new avatar url
        return {
          url: user.avatar,
        };
      } catch (err) {
        console.log(err);
        return new Error('error uploading file, user not found');
      }
    },
  },
};

// this is a utility function to promisify the stream and store the image in a buffer, which then is passed to sharp
const streamToString = stream => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

async function updateAvatarInPosts(user) {
  try {
    const posts = await Post.find({ userId: user._id });
    // console.log(posts);

    if (!posts.length) {
      console.log('no posts found to update avatar');
      return;
    }

    posts.map(async post => {
      post.avatar = user.avatar;
      await post.save();
    });
  } catch (err) {
    console.log(err);
  }
}
async function updateAvatarInComments(user) {
  try {
    const comments = await Comment.find({ userId: user._id });
    console.log(comments);

    if (!comments.length) {
      console.log('no comments found to update avatar');
      return;
    }

    comments.map(async comment => {
      comment.avatar = user.avatar;
      await comment.save();
    });
  } catch (err) {
    console.log(err);
  }
}
