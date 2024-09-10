const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const {
  updateFollower,
  getUploads,
  getPublicUploads,
  getPublicProfile,
  getPublicPlaylist,
  getRecommandedAudios,
} = require("../controllers/profileController");
const { checkout } = require("./auth");
const checkAuth = require("../middleware/checkAuth");

const router = Router();

router.post("/update-follower/:profileId", isAuth, isVerified, updateFollower);
router.get("/uploads", isAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/playlist/:profileId", getPublicPlaylist);

router.get("/recommanded", checkAuth, getRecommandedAudios);
module.exports = router;
