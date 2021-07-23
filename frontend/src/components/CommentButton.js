import React from 'react';
import { Button } from 'semantic-ui-react';

const CommentButton = ({ post }) => {
  return (
    <Button
      onClick={() => console.log('comment on post!')}
      as={'div'}
      to={`/posts/${post.id}`}
      color='blue'
      basic={true}
      icon='comments'
      label={{
        basic: true,
        color: 'blue',
        pointing: 'left',
        content: post.commentCount,
      }}
    />
  );
};

export default CommentButton;
