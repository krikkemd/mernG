import { createContext, useReducer, useEffect, useState } from 'react';
import { LOADING_FALSE, LOGIN_USER, LOGOUT_USER } from './types';
import { setAccessTokenInMemory } from '../util/accessToken';
import { Loader } from 'semantic-ui-react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null,
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
    default:
      return state;
  }
};

// used to wrap our <App />
function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // standaard loading tot dat accessToken in memory is gezet, zodat die wordt toegevoegd aan de headers
  const [loading, setLoading] = useState(true);

  // make a post request with the refCookie which has the refreshtoken, if refToken is valid. we get an accessToken back
  const refreshToken = () => {
    fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async res => {
      // we receive the accessToken inside this data, if the refreshtoken was valid
      // no need to check more
      const data = await res.json();
      console.log(data);

      if (data.accessToken) {
        // store the access token in memory, so it can be added to the headers. This is async, so we are loading before this is complete
        setAccessTokenInMemory(data.accessToken);

        // decode the accessToken which contains userdata
        const user = jwtDecode(data.accessToken);

        // silently refresh the accessToken just before it expires using the post request with the refresh token
        setTimeout(() => {
          refreshToken();
        }, 5000);

        // add the userdata to the context from the decoded accessToken
        contextLogin(user);
      }

      // accessToken is set to memory, and user is set to context at this point. we can stop loading, and render our app
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const contextLogin = userData => {
    console.log(userData);
    dispatch({ type: LOGIN_USER, payload: userData });
  };

  const contextLogout = () => {
    dispatch({ type: LOGOUT_USER });
  };

  if (loading) {
    return <Loader active content='loading...'></Loader>;
  }

  return (
    <AuthContext.Provider value={{ user: state.user, contextLogin, contextLogout }} {...props} />
  );
}

export { AuthContext, AuthProvider };
