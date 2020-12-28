"use strict";

const yup = require("yup");
const bcrypt = require("bcrypt");
const jwtDecode = require("jwt-decode");
const jwtModule = require("../../../lib/jwt");
const errorMessages = require("../../../constants/errorMessages");
const User = require("../../user/user.model");
const handleAsync = require("../../../lib/handleAsync");

const schema = yup.object().shape({
  username: yup.string().trim().min(2).max(100).required(),
  password: yup.string().min(4).max(100).required(),
});

const signin = handleAsync(async function signin(req, res, next) {
  const { username, password } = req.body;
  await schema.validate({ username, password }, { abortEarly: false });

  const user = await User.findOne({ username }).exec();

  if (user == null) {
    res.status(403);
    return next(new Error(errorMessages.invalidCredentials));
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(403);
    return next(new Error(errorMessages.invalidCredentials));
  }

  // await user.update({ last_login: new Date().toISOString() });

  const token = await jwtModule.signToken({
    id: user._id,
    username: user.username,
  });

  const decodedToken = jwtDecode(token);
  const expiresAt = decodedToken.exp;

  return res
    .status(201)
    .json({ data: { user: { username: user.username }, token, expiresAt } });
});

module.exports = signin;
