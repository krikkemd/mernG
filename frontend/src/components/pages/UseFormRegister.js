import { gql, useMutation } from '@apollo/client';
import { useForm } from '../../util/hooks';

const Register = ({ history }) => {
  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  function register() {
    return registerUser();
  }

  const { FormComponent, setErrors, setValues, values } = useForm(
    register,
    initialState,
    'Register',
  );

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
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

  return FormComponent(loading);
};

const REGISTER_USER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      token
    }
  }
`;

export default Register;
