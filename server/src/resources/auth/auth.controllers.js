"use strict";

const yup = require("yup");
const bcrypt = require("bcrypt");
const jwtModule = require("../../lib/jwt");
const errorMessages = require("../../constants/errorMessages");

const schemaSignup = yup.object().shape({
  username: yup.string().trim().min(2).max(100).required(),
  email: yup.string().trim().email().required(),
  password: yup.string().min(4).max(100).required(),
});

async function signup(req, res, next) {
  const { password, username, email } = req.body;
  try {
    await schemaSignup.validate(
      { username, email, password },
      { abortEarly: false },
    );
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await req.User.query().insert({
      ...req.body,
      password: hashedPassword,
    });

    delete user.password;

    const accessToken = await jwtModule.signToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return res.status(201).json({
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
}

const schemaSignin = yup.object().shape({
  email: yup.string().trim().email().required(),
  password: yup.string().min(4).max(100).required(),
});

async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    await schemaSignin.validate({ email, password }, { abortEarly: false });

    const user = await req.User.query()
      .findOne({ email })
      .select("id", "username", "email", "password")
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

    const accessToken = await jwtModule.signToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return res.status(201).json({ data: { user, accessToken } });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, signin };
