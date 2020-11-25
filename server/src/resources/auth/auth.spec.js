"use strict";

const faker = require("faker");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const errorMessages = require("../../constants/errorMessages");
const { app } = require("../../server");
const User = require("../user/user.model");
const { signToken } = require("../../lib/jwt");

describe("User Signup", () => {
  let user;
  beforeEach(async () => {
    await User.query().delete();
    user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
  });
  test("should return valid response when signup is succesfull", async () => {
    const { body } = await supertest(app)
      .post("/auth/signup")
      .send(user)
      .expect(201)
      .expect("Content-Type", /json/);
    expect(body.data.user.username).toBe(user.username);
    expect(body.data.user.password).toBeFalsy();
    expect(body.data.accessToken).toBeTruthy();
  });

  test("should insert the user in to the databse", async () => {
    await supertest(app).post("/auth/signup").send(user);
    const userInDB = await User.query().findOne({ username: user.username });
    expect(userInDB).toBeTruthy();
    expect(userInDB.username).toEqual(user.username);
    expect(userInDB.password).not.toEqual(user.password);
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test("should return 403 if email is already registered", async () => {
  //   await User.query().insert(user);
  //   const { body } = await supertest(app)
  //     .post("/auth/signup")
  //     .send(user)
  //     .expect(403);
  //   expect(body.message).toBe(errorMessages.duplicateResource);
  // });

  test("should validate body for signup", async () => {
    const { body } = await supertest(app)
      .post("/auth/signup")
      .send({})
      .expect(403)
      .expect("Content-Type", /json/);
    expect(body.errors).toHaveLength(2);
  });
});

describe("User Signin", () => {
  let user;
  beforeEach(async () => {
    await User.query().delete();
    user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
  });

  test("should return valid response when signin is succesfull", async () => {
    let hash = await bcrypt.hash(user.password, 12);
    await User.query().insert({ ...user, password: hash });
    const { body } = await supertest(app)
      .post("/auth/signin")
      .send({ username: user.username, password: user.password })
      .expect(201)
      .expect("Content-Type", /json/);
    expect(body.data.user.username).toBe(user.username);
    expect(body.data.user.password).toBeFalsy();
    expect(body.data.accessToken).toBeTruthy();
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test("should 403 if email is incorrect", async () => {
  //   let hash = await bcrypt.hash(user.password, 12);
  //   await User.query().insert({ ...user, password: hash });
  //   const { body } = await supertest(app)
  //     .post("/auth/signin")
  //     .send({ email: "wrong@email.com", password: user.password })
  //     .expect(403)
  //     .expect("Content-Type", /json/);
  //   expect(body.message).toBe(errorMessages.invalidCredentials);
  // });

  test("should 403 if password is incorrect", async () => {
    let hash = await bcrypt.hash(user.password, 12);
    await User.query().insert({ ...user, password: hash });
    const { body } = await supertest(app)
      .post("/auth/signin")
      .send({ username: user.username, password: "wrongpassword" })
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

describe("Protect Middleware", () => {
  let user;
  let token;
  let userInDb;
  beforeEach(async () => {
    await User.query().delete();
    user = {
      // email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    userInDb = await User.query().insert(user);
    token = await signToken(userInDb);
  });

  test("should return 401 if no authorization token is present", async () => {
    const { body } = await supertest(app)
      .get("/me")
      .set("Authorization", `Bearerrrr ${token}`)
      .expect(401)
      .expect("Content-Type", /json/);
    expect(body.message).toBe(errorMessages.notAuthenticated);
  });

  test("should return 401 if token is not valid", async () => {
    const { body } = await supertest(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}asdasd`)
      .expect(401)
      .expect("Content-Type", /json/);
    expect(body.message).toBe(errorMessages.notAuthenticated);
  });

  test("should return 200 if token is valid", async () => {
    const { body } = await supertest(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(body.data.id).toBe(userInDb.id);
  });
});
