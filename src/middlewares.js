"use strict";

const config = require("./config");
const errorMessages = require("./constants/errorMessages");

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "ValidationError") {
    statusCode = 403;
  }
  if (err.name === "UniqueViolationError") {
    statusCode = 403;
    err.message = errorMessages.emailRegisterd;
  }
  // console.log(err);
  res.status(statusCode).json({
    message: err.message,
    stack: config.isDev && err.stack,
    errors: err.errors || undefined,
  });
}

module.exports = { notFound, errorHandler };
