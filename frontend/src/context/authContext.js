import { createContext, useReducer } from 'react';
import { LOGIN_USER, LOGOUT_USER } from './types';

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
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const contextLogin = userData => {
    dispatch({ type: LOGIN_USER, payload: userData });
  };

  const contextLogout = () => {
    dispatch({ type: LOGOUT_USER });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, contextLogin, contextLogout }} {...props} />
  );
}

export { AuthContext, AuthProvider };
