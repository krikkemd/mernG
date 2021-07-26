import React from 'react';
import { Button, Popup } from 'semantic-ui-react';

const CommentButton = ({ post, asElement }) => {
  return (
    <Popup
      content='Leave a comment'
      inverted
      trigger={
        <Button
          onClick={() => console.log('comment on post!')}
          as={asElement}
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
      }
    />
  );
};

export default CommentButton;
