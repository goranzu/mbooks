"use strict";

const supertest = require("supertest");
const { app } = require("../../../server");

const book = {
  goodreads_id: "375802",
  title: "Ender's Game (Ender's Saga, #1)",
  author: "Orson Scott Card",
  publication_year: "1985",
  average_rating: "4.30",
  image_url:
    "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1408303130l/375802._SY160_.jpg",
};

describe("Book Resource", () => {
  it("should return 201 when adding book to readinglist", async () => {
    const { body } = await supertest(app)
      .post("/api/v1/book")
      .send(book)
      .expect(201)
      .expect("Content-Type", /json/);
    expect(body.data).toEqual([]);
  });
});
