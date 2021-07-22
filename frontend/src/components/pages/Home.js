import React, { useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

// Context
import { AuthContext } from '../../context/authContext';

// GQL Queries
import { GET_POSTS } from '../../graphql/posts';

// Components
import CreatePostForm from '../CreatePostForm';

// CSS Components
import { Grid, Loader, Transition } from 'semantic-ui-react';
import PostCard from '../PostCard';

const Home = () => {
  // here we run the useQuery() Hook, and we pass it the grapql Query
  // we destructure loading, and data from the useQuery(GET_POSTS)
  const { user } = useContext(AuthContext);

  const [myQueryExecutor, { loading, data }] = useLazyQuery(GET_POSTS, {
    pollInterval: 30000,
    // variables: {
    //   limit: 10,
    // },
  });

  useEffect(() => {
    myQueryExecutor(); // we use useLazyQuery in a useEffect so we dont get react unmounted component errors
  }, [myQueryExecutor]);

  let posts;

  // data.getPosts holds the posts, which is confusing. add posts to posts variable
  // We dont use useState [post, setPosts] as this triggers infinite rerenders
  if (data) {
    console.log(data);
    posts = data.getPosts;
  }

  return (
    <div>
      {/* Loading */}
      {loading ? (
        <Loader active content='loading...' style={{ marginTop: '2rem' }} />
      ) : // user is set: Authenticated
      user || !user ? (
        <Grid columns={3} stackable divided='vertically'>
          <Grid.Row centered style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <CreatePostForm />
          </Grid.Row>

          {posts?.length ? (
            <Transition.Group as={Grid.Row} animation='scale'>
              <Grid.Column width={16}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
                  Recent posts
                </h1>
              </Grid.Column>
              {posts.map(post => (
                <Grid.Column key={post.id} style={{ marginBottom: '2rem' }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
            </Transition.Group>
          ) : (
            <Grid.Row centered textAlign='center'>
              <h3>No posts found...</h3>
            </Grid.Row>
          )}

          {/* <Grid.Row centered>
            {
              <Button
                color='red'
                content='like'
                icon='heart'
                onClick={() => {
                  getBye();
                }}
              />
            }
          </Grid.Row> */}
        </Grid>
      ) : (
        // user: null: Not authenticated
        <div>Not Authenticated</div>
      )}
    </div>
  );
};

export default Home;
