import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { AuthContext } from '../context/authContext';

// GQL
import { LIKE_POST } from '../graphql/posts';

const LikeButton = ({ post }) => {
  // Context
  const [liked, setLiked] = useState(false);
  const { user } = useContext(AuthContext);

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
  const [likePost] = useMutation(LIKE_POST, {
    variables: {
      postId: post.id,
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
