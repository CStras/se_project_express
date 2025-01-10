const Item = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  SERVER_ERROR_STATUS,
  REQUEST_CREATED,
  FORBIDDEN,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(REQUEST_CREATED).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You cannot delete this item" });
      }
      return item.deleteOne().then(() => res.send({ message: "Deleted" }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
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
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
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
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS).send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
