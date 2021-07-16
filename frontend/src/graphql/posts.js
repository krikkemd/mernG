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

export const BYE = gql`
  query Bye {
    bye
  }
`;
