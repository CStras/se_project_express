import { NOT_FOUND_STATUS } from "../utils/errors";

const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req,res) => {
  res.status(NOT_FOUND_STATUS).send({message: "Sorry, that link doesn't exist!"});
});

module.exports = router;