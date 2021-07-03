const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  /* Modifier for Post(name of the type)
  this is like a pre find or pre save in mongoose, every time a post is returned it will go through here
  Each time a Query, Mutation, or Subscription returns a post, it will go through here
  */
  Post: {
    likeCount: parent => {
      console.log('pre QUERY POST for each post that is returned');
      // Parent will hold the data that is returned: getPosts= all the posts, getPost is just that post
      return parent.likes.length;
    },
    commentCount: parent => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
