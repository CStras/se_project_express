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
  console.log(req.user._id);

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
  const { itemId } = req.params;

  Item.findById(itemId)
  .orFail()
  .then((item) => {
    if (item.owner === req.user) {
      return item.remove(() => {
        res.send({ Item: item});
      })
    }
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).send({message: err.message});
    } else {
    return res.status(500).send({message: err.message});
    }
  })
}

module.exports = { getItems, createItem, deleteItem};