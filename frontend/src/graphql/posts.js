import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query getPosts {
    getPosts {
      id
      username
      body
      likeCount
      commentCount
      createdAt
      likes {
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

export const BYE = gql`
  query Bye {
    bye
  }
`;
