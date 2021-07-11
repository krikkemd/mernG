import { gql, useMutation } from '@apollo/client';
import { useForm } from '../../util/hooks';

const Login = ({ history }) => {
  const initialState = {
    username: '',
    password: '',
  };

  // form is a custom hook, see register for original
  const { FormComponent, values, setValues, setErrors } = useForm(login, initialState, {}, 'Login');

  // callback cause loginUser is not hoisted an cannot be passed
  function login() {
    return loginUser();
  }

  // Mutation
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, res) {
      console.log(res);
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
