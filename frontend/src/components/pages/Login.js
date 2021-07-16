import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useForm } from '../../util/hooks';

// GQL Mutations
import { LOGIN_USER } from '../../graphql/auth.js';

// GQL Queries
import { setAccessToken } from '../../util/accessToken';

const Login = ({ history }) => {
  // Authcontext
  const { contextLogin } = useContext(AuthContext);

  // The fields we use in this form
  const initialState = {
    username: '',
    password: '',
  };

  // callback we can pass into our useForm hook, because loginUser() isnt hoisted.
  function login() {
    return loginUser();
  }

  // form is a custom hook, see Register.js for original
  // const {FormComponent, values, ...} are returned from the useForm, based on what we pass in: useForm(callback, initialState, err..)
  const { FormComponent, values, setValues, setErrors } = useForm(login, initialState, 'Login');

  // Mutation (login user function) it is actually a post request
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      const { login: user } = data;
      setAccessToken(user.token);

      contextLogin(user);
      setErrors({});
      setValues(initialState);

      history.push('/');
    },

    onError(err) {
      console.log(err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  // Render:
  return FormComponent(loading);
};

export default Login;
