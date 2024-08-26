const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const { favoriteToggle } = require("../controllers/favorite");

const router = Router();

router.post("/", isAuth, isVerified, favoriteToggle);

module.exports = router;
