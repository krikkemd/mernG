import { gql } from '@apollo/client';

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
