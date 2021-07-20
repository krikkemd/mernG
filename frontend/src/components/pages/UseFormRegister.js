import { useMutation } from '@apollo/client';
import { useForm } from '../../util/hooks';
import { REGISTER_USER } from '../../graphql/auth';

// context
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const Register = ({ history }) => {
  const { refreshToken } = useContext(AuthContext);

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
      console.log('update in registerUser:');
      console.log(res);

      const {
        data: { register: user },
      } = res;
      console.log(user);

      setErrors({});
      setValues(initialState);

      // contextLogin(user);

      // setAccessTokenInMemory()
      history.push('/');
    },
    onCompleted(data) {
      console.log('onCompleted:');
      console.log(data);

      refreshToken(true);
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
