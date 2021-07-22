import { useMutation } from '@apollo/client';

// GQL
import { CREATE_POST, GET_POSTS } from '../graphql/posts';

// Custom Hooks
import { useForm } from '../util/hooks';

// Semantic UI
// import { Form } from 'semantic-ui-react';

const CreatePostForm = () => {
  const initialState = {
    body: '',
  };

  function createPostCallback() {
    return createPost();
  }

  const { FormComponent, values, setValues, errors, setErrors } = useForm(
    createPostCallback,
    initialState,
    'Create Post',
    'teal',
    false,
  );

  const [createPost, { loading, client }] = useMutation(CREATE_POST, {
    update(cache, result) {
      setValues(initialState);
      console.log(cache);
      console.log(result);

      const {
        data: { createPost: newPost },
      } = result;

      console.log(newPost);

      const { getPosts: posts } = client.readQuery({ query: GET_POSTS });

      client.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: [newPost, ...posts],
        },
      });
    },

    onCompleted(data) {
      console.log(data);
    },
    onError(err) {
      console.log(err.graphQLErrors[0]);
      setErrors({ ...errors, general: err.graphQLErrors[0].message });
    },
    variables: values,
  });

  return <div className='createPost__form'>{FormComponent(loading)}</div>;
};

export default CreatePostForm;
