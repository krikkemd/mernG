import React, { useContext, useState } from 'react';
import { Button, Confirm } from 'semantic-ui-react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/client';
import { DELETE_POST, GET_POSTS } from '../graphql/posts';

const DeleteButton = ({ post }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const [deletePost, { client }] = useMutation(DELETE_POST, {
    update() {
      const { getPosts: posts } = client.readQuery({ query: GET_POSTS });

      const splicedPosts = posts.filter(cachedPost => cachedPost.id !== post.id);

      client.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: [...splicedPosts],
        },
      });
    },

    onCompleted() {
      setConfirmOpen(false);
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
