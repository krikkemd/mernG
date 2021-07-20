import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

// AuthContext
import { AuthContext } from '../context/authContext';

// For route that logged in users dont need to access: Login, Register
const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  // console.log(Component);
  // console.log(rest);
  return user ? (
    <Redirect to='/' />
  ) : (
    <Route {...rest} render={routeProps => <Component {...routeProps} />} />
  );
};

export default AuthRoute;
