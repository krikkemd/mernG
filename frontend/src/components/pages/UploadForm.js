import React from 'react';
import { useMutation } from '@apollo/client';
import { SINGLE_UPLOAD } from '../../graphql/uploads';

const UploadForm = () => {
  const [singleUpload] = useMutation(SINGLE_UPLOAD, {
    onCompleted(data) {
      console.log(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    singleUpload({ variables: { file } });
  };

  return (
    <form>
      <input type='file' onChange={handleFileChange} />
    </form>
  );
};

export default UploadForm;
