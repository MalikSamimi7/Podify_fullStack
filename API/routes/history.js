const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const {
  updateHistory,
  deleteHistory,
} = require("../controllers/historyController");
const { updateHistoryValidtionSchema } = require("../utils/schemaValidation");
const validater = require("../middleware/validator");

const router = Router();

router.post(
  "/",
  isAuth,
  validater(updateHistoryValidtionSchema),
  updateHistory
);

router.delete("/", isAuth, deleteHistory);

module.exports = router;
