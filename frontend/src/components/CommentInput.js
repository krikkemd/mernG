import React, { useContext, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ErrorContext } from '../context/errorContext';
import { CREATE_COMMENT } from '../graphql/comments';
import { Card, Form } from 'semantic-ui-react';

const CommentInput = ({ user, postId, history }) => {
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);
  const { errors, setErrors, clearErrors } = useContext(ErrorContext);

  const [createComment, { client }] = useMutation(CREATE_COMMENT, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
    onError(err) {
      console.log(err);
      console.log(err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].message);
      clearErrors();

      // If you just want the store to be cleared and don't want to refetch active queries, use client.clearStore()
      // getPosts query will run when pushed back to the homepage
      client.clearStore();

      // getPosts query will run when you're ON the homescreen when error
      if (history.location.pathname === '/') {
        client.resetStore();
      }

      setTimeout(() => {
        history.push('/');
      }, 3000);
    },
  });

  return (
    user && (
      <Card fluid>
        <Card.Header as='h3' textAlign='center' style={{ padding: 20 }}>
          Leave a Comment
        </Card.Header>
        <Card.Content>
          <Form autoComplete='off'>
            <div className='ui action input fluid'>
              <input
                type='text'
                placeholder='Comment..'
                name='comment'
                value={comment}
                onChange={e => setComment(e.target.value)}
                ref={commentInputRef}
              />
              <button
                type='submit'
                className='ui button teal'
                disabled={comment.trim() === ''}
                onClick={createComment}>
                Submit
              </button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    )
  );
};

export default CommentInput;
