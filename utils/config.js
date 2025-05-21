const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function createToken(user) {
  // Make sure the `user` object has an `_id` property to avoid undefined token payloads
  if (!user || !user._id) {
    throw new Error('User object with _id is required to create a token');
  }
  return jwt.sign({ _id: user._id }, JWT_SECRET);
}

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wtwrdb',
  createToken,
};
