const { Schema, models, model } = require("mongoose");

const favoriteSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
  },
  { timestamps: true }
);

module.exports = models.Favorite || model("Favorite", favoriteSchema);
