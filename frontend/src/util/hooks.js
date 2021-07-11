import { useState } from 'react';

// useForm is a custom hook we can use for all our forms
/*
1) callback = the function that should be called when the form is submitted successfully (register, login)
2) initialState = generic passed in field values:
 { username: '', password: ''}
 or 
 { username: '', email: '', password: '', confirmPassword: ''}

 3) initialsErrors same as above

*/
export const useForm = (callback, initialState = {}, initialErrors = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  const onChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    callback();
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    onChange,
    onSubmit,
  };
};
