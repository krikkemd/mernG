import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';

// GQL
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_SINGLE_POST } from '../../graphql/posts';
import { CREATE_COMMENT } from '../../graphql/comments';

// Context
import { AuthContext } from '../../context/authContext';
import { ErrorContext } from '../../context/errorContext';

// Components
import ReadMore from '../ReadMore';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';
import CommentButton from '../CommentButton';

// Semantic UI
import { Card, Form, Grid, Image, Loader, Transition } from 'semantic-ui-react';

const SinglePost = props => {
  // Context
  const { user } = useContext(AuthContext);
  const { errors, setErrors, clearErrors } = useContext(ErrorContext);

  // Local State
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);

  const postId = props.match.params.postId;

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
      console.log(err.graphQLErrors[0].message);
      setErrors(err.graphQLErrors[0].message);
      clearErrors();

      // If you just want the store to be cleared and don't want to refetch active queries, use client.clearStore()
      // getPosts query will run when pushed back to the homepage
      client.clearStore();

      // getPosts query will run when you're ON the homescreen when error
      if (props.history.location.pathname === '/') {
        client.resetStore();
      }

      setTimeout(() => {
        props.history.push('/');
      }, 3000);
    },
  });

  let post;

  const [myQueryExecutor, { called, loading, data, error }] = useLazyQuery(GET_SINGLE_POST, {
    variables: {
      postId,
    },
    onError(err) {
      console.log(err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].message);
      clearErrors();

      // If you just want the store to be cleared and don't want to refetch active queries, use client.clearStore()
      // getPosts query will run when pushed back to the homepage
      client.clearStore();

      // getPosts query will run when you're ON the homescreen when error
      if (props.history.location.pathname === '/') {
        client.resetStore();
      }

      setTimeout(() => {
        props.history.push('/');
      }, 3000);
    },
  });

  // console.log(NetworkStatus);

  useEffect(() => {
    myQueryExecutor();
  }, [myQueryExecutor]);

  if (error) {
    // console.log(error.graphQLErrors[0].message);
    // setErrors(error.graphQLErrors[0].message);
    return (
      <Transition.Group animation='scale'>
        {errors && Object.keys(errors).length > 0 && (
          <div className='ui negative message'>
            <ul>
              {Object.values(errors).map(error => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </Transition.Group>
    );
  }

  if (!called || loading) {
    console.log('NOT CALLED OR LOADING!');
    return <Loader active />;
  }

  if (data) {
    console.log(data);
    post = data.getPost;
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          {/* Post User Image */}
          <Image
            size='small'
            floated='right'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              {/* Post Username */}
              <Card.Header>{post.username}</Card.Header>
              <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>

              {/* Post Body */}
              <ReadMore maxTextLength={350} component={Card.Description}>
                {post.body}
              </ReadMore>
            </Card.Content>

            <hr />

            <Card.Content extra>
              {/* Like */}
              <LikeButton
                post={{
                  id: post.id,
                  likeCount: post.likeCount,
                  likes: post.likes,
                }}
              />

              {/* Comment */}
              <CommentButton post={{ id: post.id, commentCount: post.commentCount }} />

              {/* Delete */}
              {user && user.username === post.username && (
                <DeleteButton post={{ id: post.id, username: post.username }} />
              )}
            </Card.Content>
          </Card>

          {/* Errors */}
          <Transition.Group animation='scale'>
            {errors && Object.keys(errors).length > 0 && (
              <div className='ui negative message'>
                <ul>
                  {Object.values(errors).map(error => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </Transition.Group>

          {/* Comment Input */}
          {user && (
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
          )}

          {/* Comments */}
          {post.comments.map(comment => (
            <Card fluid key={comment.id}>
              <Card.Content>
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                <ReadMore maxTextLength={200}>{comment.body}</ReadMore>
                {user && user.username === comment.username && (
                  <DeleteButton
                    post={{ id: post.id }}
                    comment={{ id: comment.id, username: comment.username }}
                  />
                )}
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SinglePost;
