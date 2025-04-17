const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");
const User = require("../models/user");

// GET /users
const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.json(users))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred while fetching users." })
    );

// GET /users/me - Get the current authenticated user's info
const getCurrentUser = (req, res) => {
  const userId = req.user._id; // This comes from the token via auth middleware

  User.findById(userId)
    .then((user) => {
      if (!user)
        return res.status(NOT_FOUND).send({ message: "User not found." });
      return res.send(user);
    })
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred while fetching the user." })
    );
};

// POST /users - Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userResponse = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.code === 11000)
        return res.status(409).send({ message: "Email already exists" });
      if (err.name === "ValidationError") {
        const errorMessages = Object.values(err.errors).map(
          (error) => error.message
        );
        return res
          .status(BAD_REQUEST)
          .send({ message: errorMessages.join(", ") });
      }
      return res.status(SERVER_ERROR).send({ message: "Error creating user." });
    });
};

// POST /login - Login route
const login = (req, res) =>
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(() =>
      res.status(401).send({ message: "Invalid email or password" })
    );

// PATCH /users/me - Update user profile
const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      const userResponse = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      return res.send(userResponse); 
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided." });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Server error while updating user." });
    });
};


module.exports = { getUsers, getCurrentUser, createUser, updateUser, login };
