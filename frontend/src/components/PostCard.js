import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
import moment from 'moment';

// Context
import { AuthContext } from '../context/authContext';

// Components
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import CommentButton from './CommentButton';

// These are the PostCards on the homepage ('/')
const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  console.log(post);

  return (
    <Card fluid>
      <Card.Content>
        <Image floated='right' size='mini' src={post.avatar} />
        <Card.Header>{post.username}</Card.Header>

        {/* Link to SinglePost */}
        <Card.Meta as={Link} to={`/posts/${post.id}`}>
          {moment(post.createdAt).fromNow()}
        </Card.Meta>
        <Card.Description
          style={{
            overflowWrap: 'break-word',
            height: 150,
            overflow: 'hidden',
          }}>
          {post.body}
        </Card.Description>
      </Card.Content>

      {/* Buttons - we only pass into each button what the button needs */}
      <Card.Content extra>
        {/* Like */}
        <LikeButton post={{ id: post.id, likeCount: post.likeCount, likes: post.likes }} />

        {/* Comment */}
        <CommentButton post={{ id: post.id, commentCount: post.commentCount }} asElement={Link} />

        {/* Delete  */}
        {user && user.username === post.username && (
          <DeleteButton post={{ id: post.id, username: post.username }} />
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
