import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

// Context
import { AuthContext } from '../context/authContext';
import { ErrorContext } from '../context/errorContext';

// GQL
import { GET_POSTS, LIKE_POST } from '../graphql/posts';

// takes in the post.id, post.likeCount, post.likes <- in that order
const LikeButton = ({ post }) => {
  // Local State
  const [liked, setLiked] = useState(false);

  // Context
  const { user } = useContext(AuthContext);
  const { setErrors, clearErrors } = useContext(ErrorContext);

  const history = useHistory();
  const { postId } = useParams(); // url parameter, if present, we are on the SinglePost page. We need to redirect when we delete. see onErrors()

  //   Change button fill
  //   useEffect(() => {
  //     console.log(post.likes.find(like => like.username === user.username)); // results in the value or in undefined
  //     if (user && post.likes.find(like => like.username === user.username)) {
  //       setLiked(true);
  //     } else setLiked(false);
  //   }, [user, post.likes]);

  //   Change button fill (same code as above)
  useEffect(() => {
    const found = user && post.likes.find(like => like.username === user.username);

    user && found ? setLiked(true) : setLiked(false);
  }, [post.likes, user]);

  // GQL
  const [likePost, { client }] = useMutation(LIKE_POST, {
    variables: {
      postId: post.id,
    },
    onError(err) {
      console.log(err.graphQLErrors[0].message);
      setErrors(err.graphQLErrors[0].message);
      clearErrors(); // is on a 3s timeout -> clears the errors

      // If you just want the store to be cleared and don't want to refetch active queries, use client.clearStore()
      // getPosts will run when pushed back to the homepage
      client.clearStore();

      // When on the SinglePostPage, redirect to the homepage when the post is deleted
      if (history.location.pathname === `/posts/${postId}`) {
        setTimeout(() => {
          console.log('Error! push to homepage');
          history.push('/');
        }, 3000);
      }
    },
  });

  const likeButton = user ? (
    liked ? (
      // Already liked
      <Button
        onClick={() => likePost(post.id)}
        color='teal'
        icon='heart'
        label={{ basic: liked, color: 'teal', pointing: 'left', content: post.likeCount }}
      />
    ) : (
      // Not yet liked
      <Button
        onClick={() => likePost(post.id)}
        color='teal'
        basic={true}
        // content='Like'
        icon='heart'
        label={{ basic: true, color: 'teal', pointing: 'left', content: post.likeCount }}
      />
    )
  ) : (
    // Not Logged in
    <Button
      as={Link}
      to='/login'
      color='teal'
      basic={true}
      icon='heart'
      label={{ basic: true, color: 'teal', pointing: 'left', content: post.likeCount }}
    />
  );

  return likeButton;
};

export default LikeButton;
