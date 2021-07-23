import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/authContext';

// Page Components
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import UseFormRegister from './components/pages/UseFormRegister';
import SinglePost from './components/pages/SinglePost';

// Components
import MenuBar from './components/MenuBar';
import AuthRoute from './components/AuthRoute';

// CSS Components
import { Container } from 'semantic-ui-react';

// CSS
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { ErrorProvider } from './context/errorContext';

function App() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <Router>
          <Container>
            {/* Menubar on every page */}
            <MenuBar />
            <Route exact path='/' render={props => <Home {...props} />} />
            <AuthRoute extra={'pass props here'} exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={UseFormRegister} />
            <Route exact path='/posts/:postId' component={SinglePost} />
          </Container>
        </Router>
      </ErrorProvider>
    </AuthProvider>
  );
}

export default App;
