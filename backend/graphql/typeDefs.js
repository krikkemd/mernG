const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Upload

  type File {
    # filename: String
    # mimetype: String
    # encoding: String
    url: String!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    userId: ID
    avatar: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    post: ID!
    username: String!
    userId: ID!
    avatar: String!
    body: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    # token: String
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    bye: String!
    getPosts(limit: Int, skip: Int): [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    logout: String
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    singleUpload(file: Upload!): File!
  }

  type Subscription {
    newPost: Post!
  }
`;
