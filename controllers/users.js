const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("./errors/BadRequestError");
const NotFoundError = require("./errors/NotFoundError");
const ConflictError = require("./errors/ConflictError");
const UnauthorizedError = require("./errors/UnauthorizedError");
const ServerError = require("./errors/ServerError");

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found."));
      }
      return res.send(user);
    })
    .catch(next);
};

// POST /users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join(", ");
        return next(new BadRequestError(message));
      }
      return next(new ServerError("Error creating user."));
    });
};

// POST /login
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      return next(new ServerError("Server error during login"));
    });
};

// PATCH /users/me
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found."));
      }
      return res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided."));
      }
      return next(new ServerError("Server error while updating user."));
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
