import React, { useContext, useState } from 'react';
import { Button, Confirm } from 'semantic-ui-react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/client';
import { DELETE_POST, GET_POSTS } from '../graphql/posts';

import { useParams, useHistory } from 'react-router-dom';

const DeleteButton = ({ post }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const history = useHistory();
  const { postId } = useParams(); // url parameter, if present, we are on the SinglePost page. We need to redirect when we delete. see onCompleted()

  const [deletePost, { client }] = useMutation(DELETE_POST, {
    update() {
      const { getPosts } = client.readQuery({ query: GET_POSTS });

      const splicedPosts = getPosts.filter(cachedPost => cachedPost.id !== post.id);

      client.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: [...splicedPosts],
        },
      });
    },

    onCompleted() {
      setConfirmOpen(false);

      // When on the SinglePostPage, redirect to the homepage when the post is deleted
      if (history.location.pathname === `/posts/${postId}`) {
        history.push('/');
      }
    },

    onError(err) {
      console.log(err);
    },

    variables: {
      postId: post.id,
    },
  });

  return (
    user &&
    user.username === post.username && (
      <>
        <Button
          as='div'
          onClick={() => setConfirmOpen(true)}
          icon='trash'
          color='red'
          basic={true}
          floated='right'
        />

        {/* Confirm modal */}
        <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePost} />
      </>
    )
  );
};

export default DeleteButton;
