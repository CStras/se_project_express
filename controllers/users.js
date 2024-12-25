const User = require('../models/user');
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  SERVER_ERROR_STATUS,
  REQUEST_CREATED,
  REQUEST_SUCCESS
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(REQUEST_SUCCESS).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR_STATUS).send({message: err.message});
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
  .then((user) => {
    res.status(REQUEST_CREATED).send(user);
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_STATUS).send({message: err.message});
    }
    return res.status(SERVER_ERROR_STATUS).send({message: err.message});
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
      return res.status(NOT_FOUND_STATUS).send({message: err.message});
    }

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST_STATUS).send({message: err.message});
    }
    return res.status(SERVER_ERROR_STATUS).send({message: err.message});
  });
}

module.exports = { getUsers, createUser, getUser };