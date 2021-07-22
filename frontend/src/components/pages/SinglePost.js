import React, { useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { GET_SINGLE_POST } from '../../graphql/posts';

// Semantic UI
import { Card, Grid, Image, Loader } from 'semantic-ui-react';
import LikeButton from '../LikeButton';

const SinglePost = props => {
  console.log(props);
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);
  let post;

  const [myQueryExecutor, { called, loading, data }] = useLazyQuery(GET_SINGLE_POST, {
    variables: {
      postId,
    },
  });

  useEffect(() => {
    myQueryExecutor();
  }, [myQueryExecutor]);

  if (called && loading) return <p>Loading ...</p>;
  if (!called) {
    return <button onClick={() => myQueryExecutor()}>Load greeting</button>;
  }

  if (data) {
    console.log(data);
    post = data.getPost;
  }

  return loading ? (
    <div>LOADING</div>
  ) : (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            size='small'
            floated='right'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{post.username}</Card.Header>
              <Card.Description>{post.body}</Card.Description>
              <Card extra>
                <LikeButton
                  post={{
                    id: post.id,
                    likeCount: post.likeCount,
                    likes: post.likes,
                  }}
                />
              </Card>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SinglePost;