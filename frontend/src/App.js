import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/authContext';

// Page Components
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import UseFormRegister from './components/pages/UseFormRegister';

// Components
import MenuBar from './components/MenuBar';

// CSS Components
import { Container } from 'semantic-ui-react';

// CSS
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          {/* Menubar on every page */}
          <MenuBar />
          <Route exact path='/' render={props => <Home {...props} />} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={UseFormRegister} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
