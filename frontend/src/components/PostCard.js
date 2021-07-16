import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import moment from 'moment';

const PostCard = ({ post: { id, username, body, createdAt, likeCount, likes, commentCount } }) => {
  //   Local functions
  const likePost = () => console.log('like post');
  const commentOnPost = () => console.log('comment on post');
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
        <Button
          onClick={likePost}
          color='teal'
          basic={true}
          content='Like'
          icon='heart'
          label={{ basic: true, color: 'teal', pointing: 'left', content: likeCount }}
        />
        <Button
          onClick={commentOnPost}
          color='blue'
          basic={true}
          content='Comment'
          icon='comments'
          label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
        />
      </Card.Content>
    </Card>
  );
};

export default PostCard;
