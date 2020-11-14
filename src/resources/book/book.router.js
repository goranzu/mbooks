"use strict";

const { Router } = require("express");

const bookRouter = Router();

bookRouter.route("/").post(function createBook(req, res) {
  return res.status(201).json({ data: [] });
});

module.exports = bookRouter;
