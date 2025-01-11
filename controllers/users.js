const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  SERVER_ERROR_STATUS,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!email || !password) {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({ message: "This email is already in use." });
      }
      if (email === user?.email) {
        return res
          .status(CONFLICT)
          .send({ message: "This email is already in use." });
      }
      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((data) => {
            res.setHeader("Content-Type", "application/json").send({
              name: data.name,
              email: data.email,
              avatar: data.avatar,
            });
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              return res
                .status(BAD_REQUEST_STATUS)
                .send({ message: "Invalid format" });
            }
            return res
              .status(SERVER_ERROR_STATUS)
              .send({ message: "Invalid data" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occured on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      if (err.message.includes("Incorrect email or password")) {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Unable to find user" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req?.user?._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: "User not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS)
          .send({ message: "Could not find the profile" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({ message: "Email and password are required" });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
