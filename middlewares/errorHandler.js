

module.exports = (err, req, res, next) => {
  // your error handling logic here
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal Server Error' });
};
