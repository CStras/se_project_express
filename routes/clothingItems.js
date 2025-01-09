const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { authorize } = require("../middleware/auth");

router.get("/", getItems);

router.post("/", authorize, createItem);

router.delete("/:itemId", authorize, deleteItem); // Postman test dictates delete path is /:id when project notes say /:itemId

router.put("/:itemId/likes", authorize, likeItem);

router.delete("/:itemId/likes", authorize, unlikeItem);

module.exports = router;
