const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND_STATUS } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req,res) => {
  res.status(NOT_FOUND_STATUS).send({message: "Sorry, that link doesn't exist!"});
});

module.exports = router;