const { isValidObjectId } = require("mongoose");
const Audio = require("../models/audio");
const Favorite = require("../models/favorite");

const favoriteToggle = async (req, res, next) => {
  const audioId = req.query.audioId;
  const userId = req.user.userId;

  if (!isValidObjectId(audioId))
    res.status(422).send({ error: "audio id is invalid" });

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(422).send({ error: "audio not found" });

  let status;

  const alreadyExist = await Favorite.findOne({
    owner: userId,
    items: audioId,
  });

  if (alreadyExist) {
    await Favorite.updateOne(
      { owner: userId },
      {
        $pull: { items: audioId },
      }
    );

    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: userId });
    if (favorite) {
      await Favorite.updateOne(
        { owner: userId },
        {
          $addToSet: { items: audioId },
        }
      );
    } else {
      await Favorite.create({ owner: userId, items: [audioId] });
    }
    status = "added";
  }

  res.send({ status: status });
};

module.exports = { favoriteToggle };
