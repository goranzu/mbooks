"use strict";

const supertest = require("supertest");
const { app } = require("./server");

const request = supertest(app);

describe("Server", () => {
  test("should respond with a message on / route", async () => {
    const { body } = await request
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(body.data.message).toBe("☸ App");
  });
});
