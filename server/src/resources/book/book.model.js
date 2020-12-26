"use strict";

const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const bookSchema = new mongoose.Schema(
  {
    goodreadsId: { ...requiredString, unique: true },
    title: requiredString,
    author: requiredString,
    publicationYear: requiredString,
    averageRating: requiredString,
    imageUrl: requiredString,
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
