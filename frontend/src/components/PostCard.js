import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
import moment from 'moment';

// Components
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import CommentButton from './CommentButton';

// These are the PostCards on the homepage ('/')
const PostCard = ({ post: { id, username, body, createdAt, likeCount, likes, commentCount } }) => {
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>

      {/* Buttons - we only pass into each button what the button needs */}
      <Card.Content extra>
        {/* Like */}
        <LikeButton post={{ id, likeCount, likes }} />

        {/* Comment */}
        <CommentButton post={{ id, commentCount }} />

        {/* Delete - the user from context is defined in the button itself */}
        <DeleteButton post={{ id, username }} />
      </Card.Content>
    </Card>
  );
};

export default PostCard;
