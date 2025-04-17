const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 2,
      maxlength: [30, "Name cannot be longer than 30 characters"],
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
        message: "You must enter a valid URL",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures email is unique
      validate: {
        validator(value) {
          return validator.isEmail(value); // Validates the email format
        },
        message: "You must enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // Hide by default in queries
    },
  },
  { versionKey: false } // Disable versioning (_v field) for this schema
);

// Static method for finding a user by credentials (email and password)
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select("+password") // explicitly select password
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
