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
      expiresIn: '6s',
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
      expiresIn: '10s',
    },
  );
};
