const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const {
  favoriteToggle,
  getFavorites,
  isFav,
} = require("../controllers/favorite");

const router = Router();

router.post("/", isAuth, isVerified, favoriteToggle);

router.get("/", isAuth, getFavorites);
router.get("/is-fav", isAuth, isFav);

module.exports = router;
