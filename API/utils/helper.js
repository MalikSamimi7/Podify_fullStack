const moment = require("moment");
const History = require("../models/history");

const generateToken = (lenght = 6) => {
  let num = "";
  for (let i = 0; i < lenght; i++) {
    let randNum = Math.floor(Math.random() * 10);
    num = num.concat(randNum.toString());
  }

  return num;
};

const formatProfile = (user) => {
  const {
    _id: userId,
    name,
    email,
    verified,
    avatar,
    followers,
    followings,
  } = user;

  return {
    userId,
    name,
    email,
    verified,
    avatar: avatar?.url,
    followers: followers.length,
    followings: followings.length,
  };
};

const getUserPreviusHistory = async (req) => {
  const [result] = await History.aggregate([
    { $match: { owner: req.user.userId } },
    { $unwind: "$all" },
    {
      $match: {
        "all.date": {
          $gte: moment().subtract(30, "days").toDate(),
        },
      },
    },
    {
      $group: { _id: "$all.audio" },
    },
    {
      $lookup: {
        from: "audios",
        localField: "_id",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    { $unwind: "$audioInfo" },
    { $group: { _id: null, category: { $addToSet: "$audioInfo.category" } } },
  ]);

  if (result) {
    return result.category;
  }

  return [];
};
module.exports = { generateToken, formatProfile, getUserPreviusHistory };
