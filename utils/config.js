const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');

// When signing tokens:
const token = jwt.sign({ _id: user._id }, JWT_SECRET);
