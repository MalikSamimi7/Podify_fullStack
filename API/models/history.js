const { Schema, models, model } = require("mongoose");

const historySchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
      progress: Number,
      date: {
        type: Date,
        required: true,
      },
    },
    all: [
      {
        audio: {
          type: Schema.Types.ObjectId,
          ref: "Audio",
        },
        progress: Number,
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = models.History || model("History", historySchema);
