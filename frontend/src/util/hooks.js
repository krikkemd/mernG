import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

// useForm is a custom hook we can use for all our forms
/*
1) callback = the function that should be called when the form is submitted successfully (register, login)
2) initialState = generic passed in field values:
 { username: '', password: ''}
 or 
 { username: '', email: '', password: '', confirmPassword: ''}

 for each passed in field valie a Form.Input is rendered

 3) initialsErrors same as above

 4) title = title of the header and the button text

 5) loading is passed into the FormComponent itself

*/
export const useForm = (callback, initialState = {}, initialErrors = {}, title) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);

  const onChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    callback();
  };

  const FormComponent = loading => (
    <div className='form__container'>
      <Form loading={loading} onSubmit={onSubmit} noValidate>
        <h1 className='heading-1'>{title}</h1>

        {Object.keys(values).map(field => (
          <Form.Input
            key={field}
            label={field}
            placeholder={field}
            value={values[field]}
            name={field}
            type={field === 'password' || field === 'email' ? field : 'text'}
            onChange={onChange}
            error={errors[field] && errors[field]}
          />
        ))}
        <Button type='submit' primary>
          {title}
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

  return {
    FormComponent,
    values,
    setValues,
    errors,
    setErrors,
  };
};
