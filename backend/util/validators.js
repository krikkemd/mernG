module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'username must not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'email must not be empty.';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'email must be a valid email address';
    }
  }
  if (password === '') {
    errors.password = 'password must not be empty';
  } else if (password.length < 10) {
    errors.password = 'password must have atleast 10 characters';
  } else if (password.length >= 30) {
    errors.password = 'password too long, max 30 characters';
  } else if (password !== confirmPassword) {
    errors.password = 'passwords do not match';
  }

  if (confirmPassword === '') {
    errors.confirmPassword = 'password must not be empty';
  } else if (confirmPassword.length < 10) {
    errors.confirmPassword = 'password must have atleast 10 characters';
  } else if (password.length >= 30) {
    errors.confirmPassword = 'password too long, max 30 characters';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'passwords do not match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'username must not be empty';
  }
  if (password.trim() === '') {
    errors.password = 'password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
