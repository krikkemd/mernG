import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id # we need the postId so apollo knows which post to update
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      # Returns the post
      id

      comments {
        id
        body
        username
        createdAt
      }

      commentCount
    }
  }
`;
