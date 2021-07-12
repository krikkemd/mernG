const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UserInputError } = require('apollo-server-express');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '10s',
    },
  );
}

function generateRefreshToken(userId) {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: '1h',
    },
  );
}

module.exports = {
  Mutation: {
    async login(parent, args, context) {
      console.log('running login mutation in users resolver');
      let { username, password } = args;
      const { res } = context;

      // checks if values are not empty
      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('errors', { errors });
      }

      // check if the user exists in the db
      const user = await User.findOne({ username });

      // throw error if user is not found
      if (!user) {
        errors.general = 'user not found';
        throw new UserInputError('user not found', { errors });
      }

      // compare user's password with input password
      const match = await bcrypt.compare(password, user.password);

      // throw error if password is wrong
      if (!match) {
        errors.general = 'wrong credentials';
        throw new UserInputError('wrong credentials', { errors });
      }

      // credentials are correct at this point -> login successful
      const token = generateToken(user);

      res.cookie('refresh', generateRefreshToken(user._id), {
        httpOnly: true,
      });

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(parent, args) {
      // destructure incoming data from the args
      let {
        registerInput: { username, email, password, confirmPassword },
      } = args;

      // check for empty values, and valid email
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('errors', { errors });
      }

      // Make sure user doesnt already exist
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

      if (user) {
        console.log(user);
        throw new UserInputError('username or email already taken', {
          errors: {
            username: 'this username or email has been taken',
            email: 'this username or email has been taken',
          },
        });
      }

      // Hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
