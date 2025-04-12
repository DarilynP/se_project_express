const mongoose = require("mongoose");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const User = require("../models/user");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() =>
      res.status(SERVER_ERROR).send({ message: "An error occurred while fetching users." })
    );
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID format" });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      return res.send(user);
    })
    .catch(() =>
      res.status(SERVER_ERROR).send({ message: "An error occurred while fetching the user." })
    );
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const errorMessages = Object.values(err.errors).map((error) => error.message);
        return res.status(BAD_REQUEST).send({ message: errorMessages.join(", ") });
      }
      return res.status(SERVER_ERROR).send({ message: "Error creating user." });
    });
};

module.exports = { getUsers, getUser, createUser };
