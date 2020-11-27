"use strict";

const config = require("./config");
const errorMessages = require("./constants/errorMessages");
const { verifyToken } = require("./lib/jwt");
const Book = require("./resources/book/book.model");
const User = require("./resources/user/user.model");

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
  if (err.name === "UniqueViolationError" || err.code === "23505") {
    statusCode = 403;
    err.message = errorMessages.duplicateResource;
    err.path = req.originalUrl;
    // err.message = errorMessages.emailRegisterd;
  }
  // console.log(err);
  res.status(statusCode).json({
    message: err.message,
    stack: config.isDev && err.stack,
    path: err.path || undefined,
    errors: err.errors || undefined,
  });
}

async function protect(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      res.status(401);
      return next(new Error(errorMessages.notAuthenticated));
    }

    const token = authorization.split("Bearer ")[1];
    if (token == null) {
      res.status(401);
      return next(new Error(errorMessages.notAuthenticated));
    }

    const payload = await verifyToken(token);

    const user = await req.User.query().findById(payload.sub);
    if (user == null) {
      res.status(401);
      return next(new Error(errorMessages.notAuthenticated));
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    next(new Error(errorMessages.notAuthenticated));
  }
}

function addDBModelsToRequest(req, res, next) {
  req.User = User;
  req.Book = Book;
  next();
}

module.exports = { notFound, errorHandler, protect, addDBModelsToRequest };