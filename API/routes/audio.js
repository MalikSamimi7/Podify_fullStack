const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const fileParser = require("../middleware/fileParser");
const validater = require("../middleware/validator");
const {
  audioValidationSchema,
  audioUpdateValidationSchema,
} = require("../utils/schemaValidation");
const { createAudio, updateAudio } = require("../controllers/audioController");
const isVerified = require("../middleware/isVerified");

const router = Router();

router.post(
  "/create",
  isAuth,
  isVerified,
  fileParser,
  validater(audioValidationSchema),
  createAudio
);

router.patch(
  "/:id",
  isAuth,
  isVerified,
  fileParser,
  validater(audioUpdateValidationSchema),
  updateAudio
);

module.exports = router;
