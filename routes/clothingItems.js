const router = require("express").Router();
const { getItems, createItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItems");

router.post("/", createItem);

router.get("/", getItems);

router.delete("/:itemId", deleteItem); // Postman test dictates delete path is /:id when project notes say /:itemId

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", unlikeItem);

module.exports = router;