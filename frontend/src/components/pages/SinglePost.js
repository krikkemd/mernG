import React, { useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { GET_SINGLE_POST } from '../../graphql/posts';

const SinglePost = props => {
  console.log(props);
  const postId = props.match.params.postId;

  const [myQueryExecutor, { data, loading }] = useLazyQuery(GET_SINGLE_POST, {
    onCompleted(data) {
      console.log(data);
    },
    variables: {
      postId,
    },
  });

  useEffect(() => {
    myQueryExecutor();
  }, [myQueryExecutor]);
  return <div>hallo</div>;
};

export default SinglePost;
