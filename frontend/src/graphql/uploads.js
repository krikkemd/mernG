import { gql } from '@apollo/client';

export const SINGLE_UPLOAD = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      url
      filename
      mimetype
      encoding
    }
  }
`;
