const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = new Error("Authorization required");
    err.statusCode = UNAUTHORIZED;
    return next(err);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = payload; // Attach payload to request
    return next(); // Continue
  } catch (err) {
    err.statusCode = UNAUTHORIZED;
    err.message = "Invalid token";
    return next(err);
  }
};
