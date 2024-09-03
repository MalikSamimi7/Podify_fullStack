const { isValidObjectId } = require("mongoose");
const User = require("../models/user");
const Audio = require("../models/audio");
const Playlist = require("../models/playlist");

const updateFollower = async (req, res) => {
  const { profileId } = req.params;
  const { userId } = req.user;

  if (!isValidObjectId(profileId))
    return res.status(422).send({ error: "invalid profile id!" });

  const profile = await User.findById(profileId);

  if (!profile) return res.status(422).send({ error: "profile not found!" });

  const alreadyAFollower = await User.findOne({
    _id: profileId,
    followers: userId,
  });

  let status;

  if (alreadyAFollower) {
    //unfollow
    await User.updateOne({ _id: profileId }, { $pull: { followers: userId } });
    status = "removed";
  } else {
    await User.updateOne(
      { _id: profileId },
      {
        $addToSet: { followers: userId },
      }
    );
    status = "added";
  }

  if (status == "added") {
    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { followings: profileId },
      }
    );
    if (status == "removed") {
      await User.updateOne(
        { _id: userId },
        { $pull: { followings: profileId } }
      );
    }
  }
  res.send({ status });
};

const getUploads = async (req, res) => {
  const { userId } = req.user;
  const { limit = "20", pageNo = "0" } = req.query;

  const data = await Audio.find({ owner: userId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");
  if (!data) return res.status(422).send({ error: "audios not found!" });

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: req.user.name, id: userId },
    };
  });
  res.send({ audios });
};

const getPublicUploads = async (req, res) => {
  const { profileId } = req.params;
  const { limit = "20", pageNo = "0" } = req.query;

  if (!isValidObjectId(profileId))
    return res.status(422).send({ error: "invalid profiled Id!" });

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate({
      path: "owner",
    });
  if (!data) return res.status(422).send({ error: "audios not found!" });

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });
  res.send({ audios });
};

const getPublicProfile = async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId))
    res.status(422).send({ error: "invalid profile Id!" });

  const user = await User.findById(profileId);
  if (!user) res.status(422).send({ error: "profile not found!" });

  res.send({
    profile: {
      id: user._id,
      name: user.name,
      followers: user.followers.length,
      avatar: user.avatar?.url,
    },
  });
};

const getPublicPlaylist = async (req, res) => {
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).send({ error: "invalid profile Id!" });

  const playlist = await Playlist.find({
    owner: profileId,
    visibility: "public",
  });
  if (!playlist) return res.send({ playlist: [] });

  res.send({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};

module.exports = {
  updateFollower,
  getUploads,
  getPublicUploads,
  getPublicProfile,
  getPublicPlaylist,
};
