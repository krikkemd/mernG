import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/client';
import { DELETE_POST, GET_POSTS } from '../graphql/posts';

const DeleteButton = ({ post }) => {
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
      <Button
        as='div'
        onClick={() => deletePost()}
        icon='trash'
        color='red'
        basic={true}
        floated='right'
      />
    )
  );
};

export default DeleteButton;
