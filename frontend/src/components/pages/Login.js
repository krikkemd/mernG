import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useForm } from '../../util/hooks';

// GQL Mutations
import { LOGIN_USER } from '../../graphql/auth.js';

const Login = ({ history }) => {
  // Authcontext
  const { refreshToken } = useContext(AuthContext);

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
  const { FormComponent, values, setValues, setErrors } = useForm(
    login,
    initialState,
    'Login',
    'primary',
    true,
  );

  // Mutation (login user function) it is actually a post request
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      // const { login: user } = data;
      console.log(data);
      // hier krijgen we de accessToken terug!
      // We moeten de acccesstoken storen in memory, zodat hij defined is in de headers voor het volgende netwerkrequest
      // setAccessTokenInMemory(user.token);

      /* 
      Update:
      We krijgen niet langer de accessToken terug
      ipv daarvan callen we refreshToken(true) = loading
      loading geeft ons tijd om het accesstoken te verkrijgen en toe te voegen aan de headers voor dat de app wordt gerendered (netwerk req)
      deze functie maakt een post request naar /refresh_token
      we krijgen het accessToken terug van de post request
      token is decoded = user
      daarna zetten we contextLogin(user)
      daarna wordt loading gestopt en de app gerenderd met accesToken in de headers, en user set to context
      */

      refreshToken(true); // true here means the app should be loading
      // contextLogin(user);

      setErrors({});
      setValues(initialState);

      history.push('/');
    },

    onError(err) {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  // Render:
  return FormComponent(loading);
};

export default Login;
