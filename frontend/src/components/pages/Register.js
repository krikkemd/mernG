import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

const Register = ({ history }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, res) {
      console.log(res);
      setErrors({});
      setValues({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      history.push('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const onChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    registerUser();
  };

  return (
    <div className='form__container'>
      <Form loading={loading} onSubmit={onSubmit} noValidate>
        <h1 className='heading-1'>Register</h1>
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
          label='Email'
          placeholder='Email..'
          value={values.email}
          name='email'
          type='email'
          onChange={onChange}
          error={errors.email && errors.email}
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
        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password..'
          value={values.confirmPassword}
          name='confirmPassword'
          type='password'
          onChange={onChange}
          error={errors.confirmPassword && errors.confirmPassword}
        />
        <Button type='submit' primary>
          Register
        </Button>
      </Form>
    </div>
  );
};

const REGISTER_USER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      # token
    }
  }
`;

export default Register;
