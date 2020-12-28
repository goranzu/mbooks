"use strict";

const mongoose = require("mongoose");

function connectDb(url) {
  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
}

module.exports = connectDb;
