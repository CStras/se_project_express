const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const authorize = require("../middleware/auth");

router.get("/", getItems);

router.use(authorize);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
