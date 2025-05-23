const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const ConflictError = require('./ConflictError');
const UnauthorizedError = require('./UnauthorizedError');
const ServerError = require('./ServerError');
const InternalServerError = require('./InternalServerError');

module.exports = {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ServerError,
  InternalServerError,
};
