const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    bye(_parent, _args, context) {
      checkAuth(context);
      return 'Bye!';
    },
  },
};
