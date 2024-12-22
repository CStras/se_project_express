const Item = require("../models/clothingItem");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({message: err.message});
    });
}

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user;

    Item.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(400).send({message: err.message});
      } else {
        return res.status(500).send({message: err.message});
        }
    });
}

const deleteItem = (req, res) => {
  const itemId = req.params;

  Item.findByIdAndDelete(itemId.id)
  .orFail()
  .then(() => {
    res.status(200).send({})
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({message: err.message});
    } else if (err.name === "CastError") {
      return res.status(400).send({message: err.message})
    } else {
      return res.status(500).send({message: err.message});
    }
  })
}

const likeItem = (req, res) => {
  Item.findByIdAndUpdate( req.params.itemId, { $addToSet: { likes: req.user._id}}, { new: true })
  .orFail()
  .then((item) => {
    res.status(200).send(item);
  })
  .catch((err) => {
    console.error(err)

    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({message: err.message});
    } else if (err.name === "CastError") {
      return res.status(400).send({message: err.message});
    }

  });
}

const unlikeItem = (req, res) => {

  Item.findByIdAndUpdate( req.params.itemId, { $pull: { likes: req.user._id}}, { new: true })
  .orFail()
  .then((item) => {
    res.status(200).send(item);
  })
  .catch((err) => {
    console.error(err)

    if (err.name === "DocumentNotFoundError") {
      return res.status(404).send({message: err.message});
    } else if (err.name === "CastError") {
      return res.status(400).send({message: err.message});
    }

  });
}

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };