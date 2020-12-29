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

function getRequest(url, token) {
  return supertest(app).get(url).set("Authorization", `Bearer ${token}`);
}

function deleteRequest(url, token) {
  return supertest(app).delete(url).set("Authorization", `Bearer ${token}`);
}

function postRequest(url, token, body) {
  return supertest(app)
    .post(url)
    .set("Authorization", `Bearer ${token}`)
    .send(body);
}

describe("ReadingList", () => {
  let user;
  let token;
  beforeEach(async () => {
    const u = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const hash = await bcrypt.hash(u.password, 10);
    user = await User.create({ username: u.username, password: hash });
    user = user.toObject();
    token = await signToken({ id: user._id, username: user.username });
  });

  test("should return 200 when requesting readinglist", async () => {
    const { body } = await getRequest(
      `/api/v1/book/?status=planToRead`,
      token,
    ).expect(200);
    expect(body.data).toHaveLength(0);
  });

  test("should return readingList with 2 books on it", async () => {
    await User.findByIdAndUpdate(user._id, {
      $push: { readingList: { $each: [book1, book2] } },
    })
      .lean()
      .exec();
    const { body } = await getRequest(
      `/api/v1/book?status=planToRead`,
      token,
    ).expect(200);
    expect(body.data).toHaveLength(2);
  });

  test("should add one book to the readinglist and return the readinglist", async () => {
    const { body } = await postRequest(
      `/api/v1/book?status=planToRead`,
      token,
      book1,
    ).expect(201);
    expect(body.data).toHaveLength(1);
  });

  test("should remove one book from the readinglist", async () => {
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { readingList: { $each: [book1, book2] } },
      },
      { new: true },
    )
      .lean()
      .exec();
    const { body } = await deleteRequest(
      `/api/v1/book/${book2.goodreadsId}?status=planToRead`,
      token,
      book1,
    ).expect(200);
    expect(body.data).toHaveLength(1);
  });
});
