import React, { useEffect, useContext } from 'react';
import moment from 'moment';

// GQL
import { useLazyQuery } from '@apollo/client';
import { GET_SINGLE_POST } from '../../graphql/posts';

// Context
import { ErrorContext } from '../../context/errorContext';

// Semantic UI
import { Card, Grid, Image, Loader, Transition } from 'semantic-ui-react';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';
import CommentButton from '../CommentButton';

const SinglePost = props => {
  const { errors } = useContext(ErrorContext);
  const postId = props.match.params.postId;

  let post;

  const [myQueryExecutor, { called, loading, data }] = useLazyQuery(GET_SINGLE_POST, {
    variables: {
      postId,
    },
    onError(err) {
      console.log(err);
    },
  });

  // console.log(NetworkStatus);

  useEffect(() => {
    myQueryExecutor();
  }, [myQueryExecutor]);

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
              <Card.Description>{post.body}</Card.Description>
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

              {/* Delete - the user from context is defined in the button itself */}
              <DeleteButton props={props} post={{ id: post.id, username: post.username }} />
            </Card.Content>
          </Card>

          {/* Errors */}
          <Transition.Group animation='scale'>
            {errors && Object.keys(errors).length > 0 && (
              <div className='ui negative message'>
                <ul>
                  {Object.values(errors).map(error => (
                    <li>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </Transition.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SinglePost;
