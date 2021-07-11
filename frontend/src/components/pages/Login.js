import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from '../../util/hooks';

const Login = ({ history }) => {
  const initialState = {
    username: '',
    password: '',
  };

  // form is a custom hook, see register for original
  const { values, setValues, errors, setErrors, onChange, onSubmit } = useForm(login, initialState);

  // callback cause loginUser is not hoisted an cannot be passed
  function login() {
    return loginUser();
  }

  // Mutation
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, res) {
      console.log(res);
      setErrors({});
      setValues(initialState);
      history.push('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  return (
    <div className='form__container'>
      <Form loading={loading} onSubmit={onSubmit} noValidate>
        <h1 className='heading-1'>Login</h1>
        <Form.Input
          label='Username'
          placeholder='Username..'
          value={values.username}
          name='username'
          type='text'
          onChange={onChange}
          error={errors.username && errors.username}
        />
        <Form.Input
          label='Password'
          placeholder='Password..'
          value={values.password}
          name='password'
          type='password'
          onChange={onChange}
          error={errors.password && errors.password}
        />
        <Button type='submit' primary>
          Login
        </Button>
        {errors.general && (
          <div className='ui negative message'>
            <ul>
              {Object.values(errors).map(error => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </Form>
    </div>
  );
};

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export default Login;
