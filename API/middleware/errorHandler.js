const errorHandler = (error, req, res) => {
  if (error) return res.status(500).send({ error: error.message });
};

module.exports = errorHandler;
