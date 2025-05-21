const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const { baseURL } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log("Authorization header:", authorization);
  // console.log("Extracted token:", token);
  // console.log("Verified payload:", payload);

  // Check if header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET); // Verify token using JWT_SECRET
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }

  req.user = payload; // Attach user info (e.g., _id) from the token to the request object

  return next(); // Proceed to the next middleware/route handler
};
