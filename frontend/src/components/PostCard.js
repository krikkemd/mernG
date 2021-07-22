import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import moment from 'moment';

// Context
import { AuthContext } from '../context/authContext';

// Components
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

const PostCard = ({ post: { id, username, body, createdAt, likeCount, likes, commentCount } }) => {
  const { user } = useContext(AuthContext);

  //   Local functions
  const commentOnPost = () => console.log('comment on post');
  const deletePost = () => console.log('delete post');
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
      <Card.Content extra>
        {/* Like */}
        <LikeButton post={{ id, likeCount, likes }} />

        {/* Comment */}
        <Button
          onClick={commentOnPost}
          as={Link}
          to={`/posts/${id}`}
          color='blue'
          basic={true}
          icon='comments'
          label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
        />

        {/* Delete */}
        <DeleteButton post={{ id, username }} />
      </Card.Content>
    </Card>
  );
};

export default PostCard;
