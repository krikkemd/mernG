import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query getPosts($limit: Int, $skip: Int) {
    getPosts(limit: $limit, skip: $skip) {
      id
      username
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
        body
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
