"use strict";

const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const bookRef = [
  {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    required: true,
  },
];

const userSchema = new mongoose.Schema(
  {
    username: requiredString,
    password: requiredString,
    lastLogin: {
      type: Date,
    },
    readingList: bookRef,
    finishedReading: bookRef,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);

module.exports = User;
