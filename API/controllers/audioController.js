const Audio = require("../models/audio");
const cloudinary = require("../cloud/index");
const User = require("../models/user");

const createAudio = async (req, res) => {
  const { title, about, category } = req.body;

  let file = req.files.file;
  let poster = req.files.poster;
  if (!file) return res.status(422).json({ error: "an audio is required" });

  file = file[0];

  const ownerId = req.user.userId;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    { resource_type: "video" }
  );

  const newAudio = new Audio({
    title,
    about,
    category,
    owner: ownerId,
    file: { url: secure_url, publicId: public_id },
  });

  if (poster) {
    poster = poster[0];
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });

    newAudio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await newAudio.save();

  res.status(201).json({
    audio: {
      title,
      about,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
    },
  });
};

const updateAudio = async (req, res) => {
  const { title, about, category } = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (!user) return res.status(422).send({ error: "owner not found" });

  const audio = await Audio.findOne({ owner: userId });
  if (!audio) return res.status(422).send({ error: "audio not found" });

  audio.title = title;
  audio.about = about;
  audio.category = category;

  await audio.save();

  res.status(201).send({ audio: audio });
};

const getLatestUploads = async (req, res) => {
  const data = await Audio.find()
    .sort("-createdAt")
    .limit(10)
    .populate("owner");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner?.name, id: item.owner?._id },
    };
  });

  res.send(audios);
};

module.exports = { createAudio, updateAudio, getLatestUploads };
