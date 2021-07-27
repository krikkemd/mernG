// const checkAuth = require('../../util/check-auth');
const { GraphQLUpload } = require('graphql-upload');
const path = require('path');
const fs = require('fs');

module.exports = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent, { file }, context) => {
      console.log('running singleUpload');
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream();
      const pathName = path.join(__dirname, `../../public/images/${filename}`);

      //   console.log(__dirname);
      //   console.log(pathName);

      await stream.pipe(fs.createWriteStream(pathName));

      //   return { filename, mimetype, encoding };
      return {
        url: `http://localhost:4000/images/${filename}`,
        filename,
        mimetype,
        encoding,
      };
    },
  },
};
