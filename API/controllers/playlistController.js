const Audio = require("../models/audio");
const playlist = require("../models/playlist");

const create = async (req, res) => {
  const { title, visibility, resId } = req.body;
  const ownerId = req.user.userId;

  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio) return res.status(422).send({ error: "audio not found" });
  }
  const newPlaylist = new playlist({ title, owner: ownerId, visibility });
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
  const { title, item, visibility } = req.body;
  const ownerId = req.user.userId;
  res.send({ ok: ok });
};

module.exports = { create, updatePlaylist };
