const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

// 1) The apollo server receives the (express) request object, and forwards it to the context so we can access it in our resolvers contexts.
// 2) The request object contains amongst many other things, the authorization header (req.headers.authorizations)
// 3) If there is an authorization header sent along with the (http) request, try to decode and verify it using jwt.verify(incoming token, JWT_SECRET)
// 4) if the token is valid, return the decoded token (user), which contains:  { id: _id, username: username, email: email }
// 5) so we return the user, which is actually the decoded token
module.exports = context => {
  // context = { ...header }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    //   Bearer ....
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        // WHY TRY CATCH? jwt.verify is async when callback is used (catchAsync)
        /* jwt.verify(token, secretOrPublicKey, [options, callback]):
        (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
        */

        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
      } catch (error) {
        throw new AuthenticationError('invalid or expired token');
      }
    }
    throw new Error("authentication token must be 'Bearer [token]");
  }
  throw new Error('authorization header must be provided');
};
