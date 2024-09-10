const { isValidObjectId } = require("mongoose");
const Audio = require("../models/audio");
const Playlist = require("../models/playlist");

const create = async (req, res) => {
  const { title, visibility, resId } = req.body;
  const ownerId = req.user.userId;

  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio) return res.status(422).send({ error: "audio not found" });
  }
  const newPlaylist = new Playlist({ title, owner: ownerId, visibility });
  if (resId) newPlaylist.items = [resId];

  await newPlaylist.save();

  res.send({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

const updatePlaylist = async (req, res) => {
  const { title, item, visibility, id } = req.body;
  const ownerId = req.user.userId;

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: ownerId },
    { title, visibility },
    { new: true }
  );

  if (!playlist) return res.status(422).send({ error: "playlist not found!" });

  if (item) {
    const audio = await Audio.findById(item);
    if (!audio) return res.status(422).send({ error: "audio not found!" });

    // playlist.items.push(item);
    // await playlist.save();

    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: item },
    });
  }

  res.send({ ok: playlist });
};

const removePlaylist = async (req, res) => {
  const { playlistId, resId, all } = req.query;
  const ownerId = req.user.userId;

  if (!isValidObjectId(playlistId))
    return res.status(422).send({ error: "invalid playlist id!" });

  if (all == "yes") {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: ownerId,
    });
    if (!playlist)
      return res.status(422).send({ error: "playlist not found!" });
  }

  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).send({ error: "invalid playlist id!" });
    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: ownerId },
      { $pull: { items: resId } }
    );
    if (!playlist)
      return res.status(422).send({ error: "playlist not found!" });
  }
  res.send({ success: "true" });
};
const getByProfile = async (req, res) => {
  const ownerId = req.user.userId;
  const { pageNo = "0", limit = "20" } = req.query;

  const data = await Playlist.find({
    owner: ownerId,
    visibility: { $ne: "auto" },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  if (!data)
    return res.status(422).send({ error: "no playlist is available!" });
  const playlist = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      playlistItems: item.items.length,
      visibility: item.visibility,
    };
  });

  res.send({ playlist });
};

const getAudios = async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user.userId;

  if (!isValidObjectId(playlistId))
    return res.status(422).send({ error: "invalid playlist id!" });

  const playlist = await Playlist.findOne({
    owner: userId,
    _id: playlistId,
  }).populate({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playlist) return res.status(422).send({ error: "playlist not found!" });

  res.send({ playlist });
};

module.exports = {
  create,
  updatePlaylist,
  removePlaylist,
  getByProfile,
  getAudios,
};
