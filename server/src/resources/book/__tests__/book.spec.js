"use strict";

const supertest = require("supertest");
const { app } = require("../../../server");
const User = require("../../user/user.model");
const bcrypt = require("bcrypt");
const jwt = require("../../../lib/jwt");

async function setupUser(model) {
  let u = {
    username: "test",
    // email: "test@test.com",
    password: "testing",
  };
  const hash = await bcrypt.hash(u.password, 12);
  const user = await model.query().insert({ ...u, password: hash });

  const token = await jwt.signToken(user);

  return token;
}

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
  let token;
  beforeEach(async () => {
    token = await setupUser(User);
  });

  afterEach(async () => {
    await User.query().delete();
  });

  it("should return 201 when adding book to readinglist", async () => {
    const { body } = await supertest(app)
      .post("/api/v1/book")
      .set("Authorization", `Bearer ${token}`)
      .send(book)
      .expect(201)
      .expect("Content-Type", /json/);
    expect(body.data.author).toEqual(book.author);
  });
});
