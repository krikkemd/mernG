import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

// useForm is a custom hook we can use for all our forms
/*
1) callback = the function that should be called when the form is submitted successfully (register, login)
2) initialState = generic passed in field values:
 { username: '', password: ''}
 or 
 { username: '', email: '', password: '', confirmPassword: ''}

 for each passed in field value a Form.Input is rendered
 field types:
  a) if the field is 'confirmPassword': type = 'password'
  b) if the field is password: type = 'password'
  c) if the field is email: type = 'email'
  d) else the field type = 'text'

3) title = title of the header and the button text
4) semantic ui 'loading' is passed into the FormComponent(loading) <- itself, because it cannot be accessed earlier 
  this is for the form to show a loading animation on submit
*/
export const useForm = (callback, initialState = {}, title, buttonColor, showLable) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const onChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    callback();
    setErrors({});
    console.log(errors);
  };

  const FormComponent = loading => (
    <div className='form__container'>
      <Form loading={loading} onSubmit={onSubmit} noValidate autoComplete='off'>
        <h1 className='heading-1'>{title}</h1>

        {Object.keys(values).map(field => (
          <Form.Input
            key={field}
            label={showLable && field}
            placeholder={field}
            value={values[field]}
            name={field}
            type={
              field === 'confirmPassword'
                ? 'password'
                : field === 'password' || field === 'email'
                ? field
                : 'text'
            }
            onChange={onChange}
            error={errors[field] && errors[field]}
          />
        ))}
        <Button type='submit' color={buttonColor}>
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

  // these returned values can be destructered from the useForm() funtion call
  return {
    FormComponent,
    values,
    setValues,
    errors,
    setErrors,
  };
};
