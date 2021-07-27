import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query getPosts($limit: Int, $skip: Int) {
    getPosts(limit: $limit, skip: $skip) {
      id
      username
      userId
      avatar
      body
      likeCount
      commentCount
      createdAt
      likes {
        id
        username
      }
      comments {
        id
        username
        userId
        avatar
        body
        createdAt
      }
    }
  }
`;

export const GET_SINGLE_POST = gql`
  query GetSinglePost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      # userId
      avatar
      createdAt
      likeCount

      likes {
        username
      }

      commentCount
      comments {
        id
        body
        username
        userId
        avatar
        createdAt
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
      username
      # userId
      avatar
      body
      createdAt
      likeCount
      commentCount
      # likes {
      #   id
      #   username
      #   createdAt
      # }
      # comments {
      #   id
      #   post
      #   username
      #   body
      #   createdAt
      # }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export const BYE = gql`
  query Bye {
    bye
  }
`;
