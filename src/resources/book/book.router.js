"use strict";

const express = require("express");

const bookRouter = express.Router();

bookRouter.route("/").post(function createBook(req, res) {
  return res.status(201).json({ data: [] });
});

module.exports = bookRouter;
