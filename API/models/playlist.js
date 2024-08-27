const { Schema, models, model, SchemaType, SchemaTypes } = require("mongoose");

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: "Audio", required: true }],
    visibility: {
      type: String,
      enum: ["public", "private", "auto"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = models.PlayList || model("PlayList", playlistSchema);
