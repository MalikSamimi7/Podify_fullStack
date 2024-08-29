const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const validater = require("../middleware/validator");
const {
  playlistValidationSchema,
  updatePlaylistValidationSchema,
} = require("../utils/schemaValidation");
const {
  create,
  updatePlaylist,
  removePlaylist,
  getByProfile,
  getAudios,
} = require("../controllers/playlistController");

const router = Router();

router.get(
  "/create",
  isAuth,
  isVerified,
  validater(playlistValidationSchema),
  create
);

router.patch(
  "/",
  isAuth,
  validater(updatePlaylistValidationSchema),
  updatePlaylist
);

router.delete("/", isAuth, removePlaylist);

router.get("/get-byProfile", isAuth, getByProfile);
router.get("/:playlistId", isAuth, getAudios);

module.exports = router;
