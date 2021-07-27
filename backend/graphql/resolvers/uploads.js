const checkAuth = require('../../util/check-auth');
const { GraphQLUpload } = require('graphql-upload');
const { UserInputError } = require('apollo-server-express');
const User = require('../../models/User');
const path = require('path');
// const fs = require('fs');
const sharp = require('sharp');
const Post = require('../../models/Post');

module.exports = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent, { file }, context) => {
      console.log('running singleUpload');

      // check if user is logged in
      const { id } = checkAuth(context);

      try {
        // Find the user in the db
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

        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams
        // const pathName = path.join(__dirname, `../../public/images/${filename}`);

        //   console.log(__dirname);
        //   console.log(pathName);

        // await stream.pipe(fs.createWriteStream(pathName));

        user.avatar = `http://localhost:4000/images/${name}`;

        // Update user avatar inside DB users collection
        await user.save();

        // update all posts avatars where the post.username === logged in user.username
        await updateAvatarInPosts(user);

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
    const posts = await Post.find({ username: user.username });
    console.log(posts);

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
