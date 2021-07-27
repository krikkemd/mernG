// const checkAuth = require('../../util/check-auth');
const { GraphQLUpload } = require('graphql-upload');
const { UserInputError } = require('apollo-server-express');
const path = require('path');
// const fs = require('fs');
const sharp = require('sharp');

module.exports = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent, { file }, context) => {
      console.log('running singleUpload');
      const { createReadStream, filename, mimetype, encoding } = await file;

      if (!mimetype.startsWith('image')) {
        return new UserInputError('file should be an image');
      }

      const stream = createReadStream();
      const image = await streamToString(stream);

      const extensions = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];

      let name;
      extensions.map(extension => {
        if (filename.includes(extension)) {
          console.log(true);
          name = `userId-${Date.now()}-${filename.replace(extension, '.webp')}`;
        }
      });

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

      return {
        url: `http://localhost:4000/images/${name}`,
        filename: name,
        mimetype,
        encoding,
      };
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
