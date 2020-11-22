"use strict";

const supertest = require("supertest");
const { app } = require("./server");

describe("Server", () => {
  test("should respond with a message on / route", async () => {
    const { body } = await supertest(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(body.data.message).toBe("☸ App");
  });
});
