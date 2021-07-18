const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { UserInputError } = require('apollo-server-express');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

const { generateToken, generateRefreshToken, sendRefCookie } = require('../../util/tokens');

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
      const user = await User.findOne({ username }).select('+password');

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
      // const token = generateToken(user);
      /* UPDATE 
      1) we no longer generate and send the accesstoken on login. 

      2) token is removed from User typeDef

      3) token is removed from query output
      
      4) instead we only send the refCookie holding the refToken, and make a post request to /refresh_token

      5) the post request to /refresh_token will return us the accessToken
      */

      console.log('credentials are correct at this point -> login successful');

      // store a jwt inside a cookie
      // res.cookie('refCookie', generateRefreshToken(user._id), {
      //   httpOnly: true,
      //   sameSite: true,
      //   path: '/refresh_token',
      //   expires: new Date(Date.now() + 1 * 3600000), // 1 hour
      // });

      sendRefCookie(res, user._id); // also signs and stores refToken

      return {
        ...user._doc,
        id: user._id,
        // token,
      };
    },

    async register(parent, args, { res }) {
      console.log('running register mutation in user resolver');

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

      const result = await newUser.save();

      // const token = generateToken(result);

      // store a jwt inside a cookie
      // res.cookie('refCookie', generateRefreshToken(result._id), {
      //   httpOnly: true,
      //   sameSite: true,
      //   path: '/refresh_token',
      //   expires: new Date(Date.now() + 1 * 3600000), // 1 hour
      // });

      sendRefCookie(res, result._id);

      return {
        ...result._doc,
        id: result._id,
        // token,
      };
    },
  },
};
