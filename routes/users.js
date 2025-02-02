const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const authorize = require("../middleware/auth");
const { validateUpdateBody } = require("../middleware/validation");

router.use(authorize);

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateBody, updateProfile);

module.exports = router;
