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
  console.log(ids);
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

module.exports = { updateHistory, deleteHistory };
