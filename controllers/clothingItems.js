const Item = require("../models/clothingItem");
const { REQUEST_CREATED } = require("../utils/errors");
const BadRequestError = require("../contructors/bad-request-err");
const ForbiddenError = require("../contructors/forbidden-err");
const NotFoundError = require("../contructors/not-found-err");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(REQUEST_CREATED).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError("You are not allowed to delete this item");
      }
      return item.deleteOne().then(() => res.send({ message: "Deleted" }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
