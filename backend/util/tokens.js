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

const generateRefreshToken = userId => {
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

exports.sendRefCookie = (res, userId) => {
  return res.cookie('refCookie', generateRefreshToken(userId), {
    httpOnly: true,
    path: '/refresh_token',
    sameSite: true,
    expires: new Date(Date.now() + 1 * 3600000), // 1 hour
  });
};

exports.generateRefreshToken = generateRefreshToken;
