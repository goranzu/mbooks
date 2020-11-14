"use strict";

const faker = require("faker");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const errorMessages = require("../../constants/errorMessages");
const { app } = require("../../server");
const User = require("../user/user.model");

describe("User Signup", () => {
  let user;
  beforeEach(async () => {
    await User.query().delete();
    user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });
  test("should return valid response when signup is succesfull", async () => {
    const { body } = await supertest(app)
      .post("/auth/signup")
      .send(user)
      .expect(201)
      .expect("Content-Type", /json/);
    expect(body.data.user.email).toBe(user.email);
    expect(body.data.user.password).toBeFalsy();
    expect(body.data.accessToken).toBeTruthy();
  });

  test("should insert the user in to the databse", async () => {
    await supertest(app).post("/auth/signup").send(user);
    const userInDB = await User.query().findOne({ email: user.email });
    expect(userInDB).toBeTruthy();
    expect(userInDB.email).toEqual(user.email);
    expect(userInDB.password).not.toEqual(user.password);
  });

  test("should return 403 if email is already registered", async () => {
    await User.query().insert(user);
    const { body } = await supertest(app)
      .post("/auth/signup")
      .send(user)
      .expect(403);
    expect(body.message).toBe(errorMessages.emailRegisterd);
  });

  test("should validate body for signup", async () => {
    const { body } = await supertest(app)
      .post("/auth/signup")
      .send({})
      .expect(403)
      .expect("Content-Type", /json/);
    expect(body.errors).toHaveLength(3);
  });
});

describe("User Signin", () => {
  let user;
  beforeEach(async () => {
    await User.query().delete();
    user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
  });

  test("should return valid response when signin is succesfull", async () => {
    let hash = await bcrypt.hash(user.password, 12);
    await User.query().insert({ ...user, password: hash });
    const { body } = await supertest(app)
      .post("/auth/signin")
      .send({ email: user.email, password: user.password })
      .expect(201)
      .expect("Content-Type", /json/);
    expect(body.data.user.username).toBe(user.username);
    expect(body.data.user.password).toBeFalsy();
    expect(body.data.accessToken).toBeTruthy();
  });

  test("should 403 if email is incorrect", async () => {
    let hash = await bcrypt.hash(user.password, 12);
    await User.query().insert({ ...user, password: hash });
    const { body } = await supertest(app)
      .post("/auth/signin")
      .send({ email: "wrong@email.com", password: user.password })
      .expect(403)
      .expect("Content-Type", /json/);
    expect(body.message).toBe(errorMessages.invalidCredentials);
  });

  test("should 403 if password is incorrect", async () => {
    let hash = await bcrypt.hash(user.password, 12);
    await User.query().insert({ ...user, password: hash });
    const { body } = await supertest(app)
      .post("/auth/signin")
      .send({ email: user.email, password: "wrongpassword" })
      .expect(403)
      .expect("Content-Type", /json/);
    expect(body.message).toBe(errorMessages.invalidCredentials);
  });

  test("should validate body for signin", async () => {
    const { body } = await supertest(app)
      .post("/auth/signin")
      .send({})
      .expect(403)
      .expect("Content-Type", /json/);
    expect(body.errors).toHaveLength(2);
  });
});
