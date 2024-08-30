const { isValidObjectId } = require("mongoose");
const User = require("../models/user");

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

module.exports = { updateFollower };
