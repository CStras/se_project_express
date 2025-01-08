const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
} = require("../controllers/users");

router.get("/me", getCurrentUser);

router.patch("/me", createUser);

module.exports = router;
