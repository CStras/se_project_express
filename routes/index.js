const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../contructors/not-found-err");
const {
  validateRegisterBody,
  validateLoginBody,
} = require("../middleware/validation");

router.post("/signup", validateRegisterBody, createUser);
router.post("/signin", validateLoginBody, login);

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

module.exports = router;
