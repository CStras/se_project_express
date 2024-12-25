const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req,res) => {
  res.status(404).send("Sorry, that link doesn't exist!");
});

module.exports = router;