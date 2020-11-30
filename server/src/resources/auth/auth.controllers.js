"use strict";

const yup = require("yup");
const bcrypt = require("bcrypt");
const jwtModule = require("../../lib/jwt");
const errorMessages = require("../../constants/errorMessages");
const jwtDecode = require("jwt-decode");

const schemaSignup = yup.object().shape({
  username: yup.string().trim().min(2).max(100).required(),
  password: yup.string().min(4).max(100).required(),
});

async function signup(req, res, next) {
  const { password, username } = req.body;
  try {
    await schemaSignup.validate({ username, password }, { abortEarly: false });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await req.User.query().insert({
      ...req.body,
      password: hashedPassword,
    });

    delete user.password;

    const token = await jwtModule.signToken({
      id: user.id,
      username: user.username,
    });

    const decodedToken = jwtDecode(token);
    const expiresAt = decodedToken.exp;

    return res.status(201).json({
      data: { user, token, expiresAt },
    });
  } catch (error) {
    next(error);
  }
}

const schemaSignin = yup.object().shape({
  username: yup.string().trim().min(2).max(100).required(),
  password: yup.string().min(4).max(100).required(),
});

async function signin(req, res, next) {
  const { username, password } = req.body;
  try {
    await schemaSignin.validate({ username, password }, { abortEarly: false });

    const user = await req.User.query()
      .findOne({ username })
      .select("id", "username", "password")
      .where("deleted_at", null);

    if (user == null) {
      res.status(403);
      return next(new Error(errorMessages.invalidCredentials));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(403);
      return next(new Error(errorMessages.invalidCredentials));
    }

    delete user.password;

    await req.User.query()
      .findById(user.id)
      .patch({ last_login: new Date().toISOString() });

    const token = await jwtModule.signToken({
      id: user.id,
      username: user.username,
    });

    const decodedToken = jwtDecode(token);
    const expiresAt = decodedToken.exp;

    return res.status(201).json({ data: { user, token, expiresAt } });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, signin };
