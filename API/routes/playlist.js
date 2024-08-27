const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const validater = require("../middleware/validator");
const {
  playlistValidationSchema,
  updatePlaylistValidationSchema,
} = require("../utils/schemaValidation");
const { create, updatePlaylist } = require("../controllers/playlistController");

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

module.exports = router;
