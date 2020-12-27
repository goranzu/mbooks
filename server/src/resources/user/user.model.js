"use strict";

const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const bookRef = {
  goodreadsId: { ...requiredString, unique: true },
  title: requiredString,
  author: requiredString,
  publicationYear: requiredString,
  averageRating: requiredString,
  imageUrl: requiredString,
};

const userSchema = new mongoose.Schema(
  {
    username: { ...requiredString, unique: true },
    password: requiredString,
    lastLogin: {
      type: Date,
    },
    readingList: [bookRef],
    finishedReading: [bookRef],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);

module.exports = User;
