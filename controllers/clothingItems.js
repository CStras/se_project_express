const Item = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  SERVER_ERROR_STATUS,
  REQUEST_CREATED,
  REQUEST_SUCCESS,
  FORBIDDEN,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(REQUEST_SUCCESS).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS)
        .send("An error has occurred on the server");
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(req.user);
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(REQUEST_CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (userId !== req.user._id) {
    return res
      .status(FORBIDDEN)
      .send({ message: "You cannot delete this item" });
  }

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(REQUEST_SUCCESS).send({ message: "Deleted" }); //??? why does the postman test require this to be 403?
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

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(REQUEST_SUCCESS).send(item);
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

const unlikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(REQUEST_SUCCESS).send(item);
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

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
