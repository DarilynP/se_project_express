
const errorHandler = (err, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Internal Server Error'
      : message,
  });
};

module.exports = errorHandler;
