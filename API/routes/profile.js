const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const {
  updateFollower,
  getUploads,
  getPublicUploads,
  getPublicProfile,
  getPublicPlaylist,
} = require("../controllers/profileController");

const router = Router();

router.post("/update-follower/:profileId", isAuth, isVerified, updateFollower);
router.get("/uploads", isAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/playlist/:profileId", getPublicPlaylist);
module.exports = router;
