import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// GQL mutation
import { LOGOUT_USER } from '../graphql/auth';

const MenuBar = () => {
  const { user, contextLogout } = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState(window.location.pathname.substr(1));

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const [logoutUser, { data, client }] = useMutation(LOGOUT_USER, {
    update(_, res) {
      console.log('update');
      contextLogout();
      client.clearStore();
    },
    onError(error) {
      console.log(error);
    },
  });

  return user ? (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item
        name={user.username}
        active={activeItem === user.username || activeItem === ''}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      <Menu.Item
        name={'upload'}
        active={activeItem === 'upload'}
        onClick={handleItemClick}
        as={Link}
        to='/upload'
      />
      <Menu.Menu position='right'>
        <Menu.Item name='logout' onClick={logoutUser} as={Link} to='/' />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item
        name='home'
        active={activeItem === 'home' || activeItem === ''}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to='/login'
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to='/register'
        />
      </Menu.Menu>
    </Menu>
  );
};

export default MenuBar;
