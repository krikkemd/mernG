const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
    minLength: [1, 'username must have atleast 1 character'],
    maxLength: [30, 'username too long, max 30 characters'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: String,
  createdAt: String,
});

module.exports = model('User', userSchema);
