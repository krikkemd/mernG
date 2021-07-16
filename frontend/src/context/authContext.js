import { createContext, useReducer, useEffect } from 'react';
import { LOADING_FALSE, LOGIN_USER, LOGOUT_USER } from './types';
import { setAccessToken } from '../util/accessToken';
import jwtDecode from 'jwt-decode';
import { Loader } from 'semantic-ui-react';

const initialState = {
  user: null,
  loading: true,
  contextLogin: userData => {},
  contextLogout: () => {},
};

// used in components to access context
const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
      };
    case LOADING_FALSE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

// used to wrap our <App />
function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshTokenFunction = () => {
    fetch('http://localhost:4000/refresh_token', {
      credentials: 'include',
      method: 'POST',
    }).then(async res => {
      const { accessToken } = await res.json();

      if (!accessToken) {
        contextLogout();
      }

      if (accessToken) {
        setAccessToken(accessToken);
        const decoded = jwtDecode(accessToken);
        console.log(decoded);

        contextLogin(decoded); // decoded token = user

        setTimeout(async () => {
          setAccessToken(accessToken);

          contextLogin(decoded);
          refreshTokenFunction();
        }, 29000);
      }

      // setLoading(false);
      // loadingFalse();
    });
  };

  // useEffect(() => {
  //   refreshTokenFunction();
  // }, []);

  const loadingFalse = () => {
    dispatch({ type: LOADING_FALSE });
  };

  const contextLogin = userData => {
    console.log(userData);
    dispatch({ type: LOGIN_USER, payload: userData });
  };

  const contextLogout = () => {
    dispatch({ type: LOGOUT_USER });
  };

  // if (state.loading) {
  //   return <Loader active content='loading...'></Loader>;
  // }

  return (
    <AuthContext.Provider
      value={{ user: state.user, contextLogin, contextLogout, loading: state.loading }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
