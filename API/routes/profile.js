const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const { updateFollower } = require("../controllers/profileController");

const router = Router();

router.post("/update-follower/:profileId", isAuth, isVerified, updateFollower);

module.exports = router;
