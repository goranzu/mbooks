"use strict";

const faker = require("faker");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const { app } = require("../../server");
const User = require("../user/user.model");
const { signToken } = require("../../lib/jwt");

const book1 = {
  goodreadsId: "375802",
  title: "Ender's Game (Ender's Saga, #1)",
  author: "Orson Scott Card",
  publicationYear: "1985",
  averageRating: "4.30",
  imageUrl:
    "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1408303130l/375802._SY160_.jpg",
};

const book2 = {
  goodreadsId: "6393082",
  title: "Ender's Game, Volume 1: Battle School (Ender's Saga)",
  author: "Christopher Yost",
  publicationYear: "2009",
  averageRating: "4.40",
  imageUrl:
    "https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png",
};

describe("ReadingList", () => {
  let user;
  let token;
  beforeEach(async () => {
    await User.deleteMany();
    const u = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const hash = await bcrypt.hash(u.password, 10);
    user = await User.create({ username: u.username, password: hash });
    token = await signToken({ id: user._id, username: user.username });
  });

  test("should return 200 when requesting readinglist", async () => {
    const { body } = await supertest(app)
      .get(`/api/v1/user/${user._id}/readinglist`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(body.data.readingList).toHaveLength(0);
  });

  test("should return readingList with 2 books on it", async () => {
    await User.findByIdAndUpdate(user._id, {
      $push: { readingList: { $each: [book1, book2] } },
    });
    const { body } = await supertest(app)
      .get(`/api/v1/user/${user._id}/readinglist`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(body.data.readingList).toHaveLength(2);
  });
});
