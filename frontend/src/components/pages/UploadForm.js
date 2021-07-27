import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { GET_POSTS } from '../../graphql/posts';
import { SINGLE_UPLOAD } from '../../graphql/uploads';
import { AuthContext } from '../../context/authContext';

const UploadForm = () => {
  const { user, contextSingleUpload } = useContext(AuthContext);
  const [singleUpload, { client }] = useMutation(SINGLE_UPLOAD, {
    update(cache, result) {
      const { url } = result?.data.singleUpload;
      console.log(url);

      console.log(result);

      // update the current logged in user's avatar url inside the context
      if (url) contextSingleUpload(url);

      // read the posts that are currently cached (read-only)
      const postsCache = client.readQuery({ query: GET_POSTS });

      // make a writable copy of the posts cache
      let copiedPostsCache = JSON.parse(JSON.stringify(postsCache.getPosts));

      // map through all cached posts and comments, and replace the current logged in users's avatar on all posts and comments
      copiedPostsCache.map(post => {
        if (post.userId === user.id) {
          post.avatar = url;
        }
        post.comments.map(comment => {
          if (comment.userId === user.id) {
            comment.avatar = url;
          }
        });
      });

      //Check if the value is updated.
      console.log(copiedPostsCache);

      // update the cache with the avatar, no need to go to the server
      if (postsCache.getPosts && url) {
        cache.writeQuery({
          query: GET_POSTS,
          data: {
            getPosts: [...copiedPostsCache],
          },
        });
      }
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
