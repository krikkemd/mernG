import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { GET_POSTS } from '../../graphql/posts';
import { SINGLE_UPLOAD } from '../../graphql/uploads';
import { AuthContext } from '../../context/authContext';

const UploadForm = () => {
  const { user } = useContext(AuthContext);
  const [singleUpload, { client }] = useMutation(SINGLE_UPLOAD, {
    update(cache, result) {
      // Only when a post is deleted, splicePosts
      const { getPosts } = client.readQuery({ query: GET_POSTS });

      console.log(getPosts);

      // const splicedPosts = getPosts.map(cachedPost => cachedPost.userId === user.id);

      // client.writeQuery({
      //   query: GET_POSTS,
      //   data: {
      //     getPosts: [...splicedPosts],
      //   },
      // });
    },
    onCompleted(data) {
      console.log(data);
      // client.resetStore();
      // client.clearStore();
    },
    onError(err) {
      console.log(err);
      console.log(err.graphQLErrors);
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
