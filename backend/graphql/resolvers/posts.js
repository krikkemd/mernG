const { AuthenticationError } = require('apollo-server-express');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(parent, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(parent, { body }, context) {
      // if this passes, there is a user logged in and we can proceed
      const user = checkAuth(context);
      console.log(user);

      if (body.trim() === '') {
        throw new Error('post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post,
      });

      return post;
    },
    async deletePost(parent, { postId }, context) {
      const user = checkAuth(context);

      // check if user is post owner / author
      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return 'post deleted successfully';
        } else {
          throw new AuthenticationError('action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(parent, { postId }, context) {
      // 1) check if the user is authenticated
      const { username } = checkAuth(context);

      // 2) try to find the post
      const post = await Post.findById(postId);
      if (post) {
        // 3) if the post is found, check if the current logged in username is found inside the post's likes array:
        /* 
        The find() method returns the value of the first element in the provided array that satisfies the provided testing function.
        If no values satisfy the testing function, undefined is returned.
        
        Example:
        const likes = [{username: 'mickey'}, {username: 'dion'}]; > post has 2 likes

        const username = 'mickey';
        const username2 = 'marlies';
        
        const truthy = likes.find((like) => like.username === username && like) > Object { username: "mickey" }
        const falsey = likes.find((like) => like.username === username2 && like) > undefined
        */

        // 4) if the current logged in user's username is found inside the post.likes array > the post is already liked
        if (post.likes.find(like => like.username === username)) {
          //  5a) post already liked? > unlike the post
          // The filter() method creates a new array with all elements that pass the test implemented by the provided function.
          // so all the usernames that are not the current logged in user's username are returned inside the post.likes array
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          //  5b) post not liked? > like the post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        // 6) save and return the post
        await post.save();
        return post;
      } else {
        throw new UserInputError('post not found');
      }
    },
  },
  // Subscriptions allow you to subscribe/listen to an event, and like socket.emit('NEW_POST') like a redux type
  Subscription: {
    /* 
    This subscription is called newPost, cause we want to listen to whenever a new post is created, so after the post is saved to the DB. 
    SEE createPost() in this postsResolver file, and you will see after the post is saved:
    
    const post = await newPost.save();

    context.pubsub.publish('NEW_POST', {
        newPost: post,
      });

    so the newPost is actually the post that was just saved to the db
    we access the pubsub through the context (see index.js Apollo server passes pubsub to the context)

    */
    newPost: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('NEW_POST'), // all caps like a redux TYPE
    },
  },
};
