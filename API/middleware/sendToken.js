const sendToken = async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(201).send({ error: "invalid user" });

  const { id, email, name } = user;

  const token = generateToken();
  try {
    await sendVerificationMail(token, { userId: id, name, email });

    next();
  } catch (error) {}
};

module.exports = sendToken;
