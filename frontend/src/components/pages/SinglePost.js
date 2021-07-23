import React, { useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { GET_SINGLE_POST } from '../../graphql/posts';

// Semantic UI
import { Button, Card, Grid, Image, Loader } from 'semantic-ui-react';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';
import CommentButton from '../CommentButton';

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
                <DeleteButton post={{ id: post.id, username: post.username }} />
              </Card.Content>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SinglePost;
