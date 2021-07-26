import React, { useState } from 'react';
import { Button, Confirm, Popup } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { DELETE_POST, GET_POSTS } from '../graphql/posts';
import { DELETE_COMMENT } from '../graphql/comments';

import { useParams, useHistory } from 'react-router-dom';

const DeleteButton = ({ post, comment }) => {
  console.log(comment);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const [mutation, setMutation] = useState('');
  let mutation;

  // if there is a comment(Id) passed in, delete the comment. Else delete the post
  comment ? (mutation = DELETE_COMMENT) : (mutation = DELETE_POST);

  const history = useHistory();
  const { postId } = useParams(); // url parameter, if present, we are on the SinglePost page. We need to redirect when we delete. see onCompleted()

  const [deletePostOrComment, { client }] = useMutation(mutation, {
    update() {
      // Only when a post is deleted, splicePosts
      if (!comment) {
        const { getPosts } = client.readQuery({ query: GET_POSTS });

        const splicedPosts = getPosts.filter(cachedPost => cachedPost.id !== post.id);

        client.writeQuery({
          query: GET_POSTS,
          data: {
            getPosts: [...splicedPosts],
          },
        });
      }
    },

    onCompleted() {
      setConfirmOpen(false);

      // When on the SinglePostPage, redirect to the homepage when the post is deleted
      if (!comment) {
        if (history.location.pathname === `/posts/${postId}`) {
          history.push('/');
        }
      }
    },

    onError(err) {
      console.log(err);
    },

    variables: {
      postId: post.id,
      commentId: comment?.id,
    },
  });

  return (
    <>
      <Popup
        inverted
        content={comment?.id ? 'Delete comment' : 'Delete post'}
        trigger={
          <Button
            as='div'
            onClick={() => setConfirmOpen(true)}
            icon='trash'
            color='red'
            basic={true}
            floated='right'
          />
        }
      />

      {/* Confirm modal */}
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

export default DeleteButton;
