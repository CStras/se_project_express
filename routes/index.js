const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND_STATUS } = require("../utils/errors");
const { authorize } = require("../middleware/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemRouter);
router.use("/users", userRouter, authorize);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS)
    .send({ message: "Sorry, that link doesn't exist!" });
});

module.exports = router;
