import { gql, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useForm } from '../../util/hooks';

const Login = ({ history }) => {
  // Authcontext
  const { user, contextLogin } = useContext(AuthContext);

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
    update(_, res) {
      // rename res.data.login to user
      const {
        data: { login: user },
      } = res;
      console.log(res);
      console.log(user);

      // Add user to the global context
      contextLogin(user);
      setErrors({});
      setValues(initialState);
      history.push('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  // Render:
  return FormComponent(loading);
};

// GQL Mutation
const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export default Login;
