const jwt = require('jsonwebtoken');

exports.generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30s',
    },
  );
};

exports.generateRefreshToken = userId => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: '1m',
    },
  );
};
