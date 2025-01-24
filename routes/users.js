const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const authorize = require("../middleware/auth");

router.use(authorize);

router.get("/me", getCurrentUser);

router.patch("/me", updateProfile);

module.exports = router;
