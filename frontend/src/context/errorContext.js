import React, { createContext, useReducer } from 'react';
import { CLEAR_ERRORS, SET_ERROR } from './types';

const initialState = { errors: {}, setErrors: error => {} };

const ErrorContext = createContext(initialState);

const errorReducer = (state, action) => {
  switch (action.type) {
    case SET_ERROR:
      console.log('CONTEXT SET ERROR');
      console.log(action.payload);

      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: action.payload,
        },
      };
    case CLEAR_ERRORS:
      console.log('CONTEXT CLEAR ERRORS');
      return {
        initialState,
      };
  }
};

function ErrorProvider(props) {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const setErrors = error => dispatch({ type: SET_ERROR, payload: error });

  // Clear errors after 3 seconds
  const clearErrors = () =>
    setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS });
    }, 2500);

  return (
    <ErrorContext.Provider value={{ errors: state.errors, setErrors, clearErrors }} {...props} />
  );
}

export { ErrorContext, ErrorProvider };
