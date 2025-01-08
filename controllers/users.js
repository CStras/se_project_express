const User = require("../models/user");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  SERVER_ERROR_STATUS,
  UNATHORIZED,
  REQUEST_SUCCESS,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(REQUEST_SUCCESS).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR_STATUS).send({ message: err.message });
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(BAD_REQUEST_STATUS)
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
            console.error(err);
            if (err.name === "ValidationError") {
              return res
                .status(BAD_REQUEST_STATUS)
                .send({ message: err.message });
            }
            return res
              .status(SERVER_ERROR_STATUS)
              .send({ message: err.message });
          });
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res.status(UNATHORIZED).send({ message: "Invalid email or password" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(REQUEST_SUCCESS).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, login };
