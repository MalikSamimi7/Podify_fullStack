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

const getFavorites = async (req, res) => {
  const userId = req.user.userId;

  const { limit = "20", pageNo = "0" } = req.query;

  const favoriteItems = await Favorite.aggregate([
    {
      $match: { owner: userId },
    },
    {
      $project: {
        audioIds: {
          $slice: [
            "$items",
            parseInt(limit) * parseInt(pageNo),
            parseInt(limit),
          ],
        },
      },
    },
    {
      $unwind: "$audioIds",
    },
    {
      $lookup: {
        from: "audios",
        localField: "audioIds",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    {
      $unwind: "$audioInfo",
    },
    {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $unwind: "$ownerInfo",
    },
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        category: "$audioInfo.category",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
      },
    },
  ]);

  // const favorites = await Favorite.findOne({ owner: userId }).populate({
  //   path: "items",
  //   populate: {
  //     path: "owner",
  //   },
  // });

  //   if (favorites[0].items.length < 1)
  //     return res.status(422).send({ error: "favorite list is empty!" });

  res.send({ audios: favoriteItems });
};

const isFav = async (req, res) => {
  const userId = req.user.userId;
  const audioId = req.query.audioId;

  if (!isValidObjectId(audioId))
    return res.status(422).send({ error: "invalid audio id" });

  const favorite = await Favorite.findOne({ owner: userId, items: audioId });

  if (!favorite) return res.status(422).send({ favorite: false });

  return res.send({ favorite: true });
};

module.exports = { favoriteToggle, getFavorites, isFav };
