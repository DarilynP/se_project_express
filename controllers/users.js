const mongoose = require("mongoose");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");
const User = require("../models/user");



// GET /users
const getUsers = (req, res) => {
  // Fetch all users from the database
  User.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(NOT_FOUND).send({ message: "No users found." });
      }
      res.json(users); // Send the list of users as JSON
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "An error occurred while fetching users." });
    });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;

// Validate the userId format using mongoose's isValid method
if (!mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(BAD_REQUEST).send({ message: "Invalid user ID format" });
}

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "An error occurred while fetching the user." });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

    User.create({ name, avatar })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.name === 'ValidationError') {
          const errorMessages = Object.values(err.errors).map((error) => error.message);
          return res.status(400).send({ message: errorMessages.join(", ") }); // Send 400 Bad Request
        } else {
          return res.status(500).send({ message: "Error creating user." });
        }
      });
  };


module.exports = { getUsers, getUser, createUser };

