import { useMutation } from '@apollo/client';
import { useForm } from '../../util/hooks';
import { REGISTER_USER } from '../../graphql/auth';

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
      history.push('/login');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  return FormComponent(loading);
};

export default Register;
