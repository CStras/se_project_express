const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND_STATUS } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS)
    .send({ message: "Sorry, that link doesn't exist!" });
});

module.exports = router;
