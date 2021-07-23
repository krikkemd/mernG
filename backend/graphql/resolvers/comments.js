const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const checkAuth = require('../../util/check-auth');
const { removeWhiteSpace } = require('../../util/helperFunctions');

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, context) => {
      // 1) Check if user is logged in
      console.log(checkAuth(context));
      const { username } = checkAuth(context); // we can destructure the username from what checkAuth() returns: user

      if (body.trim() === '') {
        throw new UserInputError('empty comment', {
          errors: {
            body: 'comment body must not be empty',
          },
        });
      }

      console.log(removeWhiteSpace(body));
      console.log(removeWhiteSpace(body).length);

      // if (removeWhiteSpace(body).length > 27) {
      //   throw new UserInputError('Too many characters in a row', {
      //     errors: {
      //       body: 'Too many characters in a row',
      //     },
      //   });
      // }
      // 2) try to find the post that the user is commenting on
      const post = await Post.findById(postId);

      if (post) {
        // const newComment = new Comment({
        // post: postId,
        // body,
        // username,
        // createdAt: new Date().toISOString(),
        // });

        // const comment = await newComment.save();

        // 3) if there is a post, create the comment
        const comment = await Comment.create({
          post: postId,
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        // 4) add the comment (reference) to the comments array of the post
        post.comments.unshift({
          _id: comment._id,
          post: postId,
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        // 5) Save and return the post
        await post.save();
        return post;
      } else {
        throw new UserInputError('post not found or no longer exists');
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      // 1) check if the user is logged in
      const { username } = checkAuth(context);

      // 2) try to find the post that is commented on
      const post = await Post.findById(postId);

      if (post) {
        // 3) if the post exists, find the comment
        const comment = await Comment.findById(commentId);

        if (comment) {
          // 4) if the comment exists, find the comment index inside of the comments array on the post
          const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

          // 5) check if the comment at that index belongs to the logged in user
          if (post.comments[commentIndex].username === username) {
            // 6) if the logged in user is the author of the comment, remove the comment reference* from the comments array in the post
            // * this does not delete the comment from the Comments collection! just the reference in the comments array in the post
            post.comments.splice(commentIndex, 1);

            // 7) save the post
            await post.save();

            // 8) actually delete the comment from the Comments collection
            await comment.delete();

            // 9) return the post the comment was deleted from
            return post;
          } else {
            throw new AuthenticationError('action not allowed');
          }
        } else {
          throw new UserInputError('comment not found');
        }
      } else {
        throw new UserInputError('post not found');
      }
    },
  },
};
