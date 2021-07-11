import React from 'react';
import { gql, useQuery } from '@apollo/client';

// CSS Components
import { Grid, Loader } from 'semantic-ui-react';
import PostCard from '../PostCard';

const Home = () => {
  // here we run the useQuery() Hook, and we pass it the grapql Query
  // we destructure loading, and data from the useQuery(GET_POSTS)
  const { loading, data } = useQuery(GET_POSTS);
  let posts;

  // data.getPosts holds the posts, which is confusing. add posts to posts variable
  // We dont use useState [post, setPosts] as this triggers infinite rerenders
  if (data) posts = data.getPosts;

  return (
    <Grid columns={3}>
      <Grid.Row centered style={{ marginTop: '2rem' }}>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <Loader active content='loading...' style={{ marginTop: '2rem' }} />
        ) : (
          posts &&
          posts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: '2rem' }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

// Here we define the graphql Query
const GET_POSTS = gql`
  {
    getPosts {
      id
      username
      body
      likeCount
      commentCount
      createdAt
      likes {
        username
      }
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default Home;