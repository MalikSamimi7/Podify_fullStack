const History = require("../models/history");
const { findOneAndUpdate } = require("../models/user");

const updateHistory = async (req, res) => {
  const { userId } = req.user;
  const oldHistory = await History.findOne({ owner: userId });

  const { audio, progress, date } = req.body;

  const history = { audio, progress, date };

  if (!oldHistory) {
    await History.create({
      owner: userId,
      last: history,
      all: [history],
    });

    return res.send({ success: true });
  }

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const histories = await History.aggregate([
    {
      $match: { owner: userId },
    },
    {
      $unwind: "$all",
    },
    {
      $match: {
        "all.date": {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    },
    {
      $project: {
        _id: 0,
        audio: "$all.audio",
      },
    },
  ]);

  const sameDayHistory = histories.find((item) => {
    if (item.audio.toString() == audio) return item;
  });

  if (sameDayHistory) {
    await History.findOneAndUpdate(
      {
        owner: userId,
        "all.audio": audio,
      },
      {
        "all.$.progress": progress,
        "all.$.date": date,
      }
    );
  } else {
    await History.findByIdAndUpdate(oldHistory._id, {
      $push: { all: { $each: [history], $position: 0 } },
      $set: { last: history },
    });
  }

  res.json(histories);
};

const deleteHistory = async (req, res) => {
  const removeAll = req.query.removeAll === "yes";
  const { userId } = req.user;

  if (removeAll) {
    const history = await History.findOneAndDelete({ owner: userId });
    if (!history) return res.status(422).send({ error: "no history found!" });
    return res.send({ success: true });
  }

  const histories = req.query.histories;

  const ids = JSON.parse(histories);

  await History.findOneAndUpdate(
    {
      owner: userId,
    },
    {
      $pull: { all: { _id: ids } },
    }
  );

  res.json({ success: true });
};

const recentlyPlayedAudios = async (req, res) => {
  const { userId } = req.user;
  const data = await History.aggregate([
    { $match: { owner: userId } },
    { $project: { myHistory: { $slice: ["$all", 10] } } },
    {
      $project: {
        histories: {
          $sortArray: {
            input: "$myHistory",
            sortBy: { date: -1 },
          },
        },
      },
    },
    { $unwind: { path: "$histories", includeArrayIndex: "index" } },
    {
      $lookup: {
        from: "audios",
        localField: "histories.audio",
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
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        category: "$audioInfo.category",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        owner: { name: "$owner.name", id: "$owner._id" },
        date: "$histories.date",
        progress: "$histoires.progress",
      },
    },
  ]);

  res.send(data);
};

module.exports = { updateHistory, deleteHistory, recentlyPlayedAudios };
