import React, { useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

// Context
import { AuthContext } from '../../context/authContext';

// GQL Queries
import { BYE, GET_POSTS } from '../../graphql/posts';

// CSS Components
import { Button, Grid, Loader } from 'semantic-ui-react';
import PostCard from '../PostCard';

const Home = () => {
  // here we run the useQuery() Hook, and we pass it the grapql Query
  // we destructure loading, and data from the useQuery(GET_POSTS)
  const { user } = useContext(AuthContext);
  console.log(`user: ${user}`);

  const [myQueryExecutor, { loading, data }] = useLazyQuery(GET_POSTS);

  useEffect(() => {
    myQueryExecutor();
  }, [myQueryExecutor]);

  let posts;

  // data.getPosts holds the posts, which is confusing. add posts to posts variable
  // We dont use useState [post, setPosts] as this triggers infinite rerenders
  if (data) {
    console.log(data);
    posts = data.getPosts;
  }

  const [getBye, byeData] = useLazyQuery(BYE, {
    fetchPolicy: 'network-only',
  }); // cached!

  if (byeData.data) {
    console.log(byeData.data);
  }

  if (byeData.error) return `${byeData.error}`;

  return (
    <div>
      {/* Loading */}
      {loading ? (
        <Loader active content='loading...' style={{ marginTop: '2rem' }} />
      ) : // user is set: Authenticated
      user ? (
        <Grid columns={3}>
          <Grid.Row centered style={{ marginTop: '2rem' }}>
            <h1>Recent Posts</h1>
          </Grid.Row>
          <Grid.Row>
            {posts &&
              posts.map(post => (
                <Grid.Column key={post.id} style={{ marginBottom: '2rem' }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Grid.Row>
          <Grid.Row centered>
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
          </Grid.Row>
        </Grid>
      ) : (
        // user: null: Not authenticated
        <div>Not Authenticated</div>
      )}
    </div>
  );
};

export default Home;
