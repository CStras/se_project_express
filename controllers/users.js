const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const BadRequestError = require("../contructors/bad-request-err");
const ConflictError = require("../contructors/conflict-err");
const ForbiddenError = require("../contructors/forbidden-err");
const NotFoundError = require("../contructors/not-found-err");
const UnauthorizedError = require("../contructors/unauth-err");
const {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  UNAUTHORIZED,
  REQUEST_CREATED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email is already in use."));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("Email is already in use.");
      }
      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash }).then((data) => {
          res
            .status(REQUEST_CREATED)
            .setHeader("Content-Type", "application/json")
            .send({
              name: data.name,
              email: data.email,
              avatar: data.avatar,
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.message === "Email already in use") {
        return next(
          new ConflictError("An account exists already with this email")
        );
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      if (err.message.includes("Incorrect email or password")) {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
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
        return next(new NotFoundError("Could not find the items"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
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
        return next(new NotFoundError("Could not find the items"));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
