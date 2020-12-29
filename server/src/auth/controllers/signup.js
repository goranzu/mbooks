"use strict";

const yup = require("yup");
const bcrypt = require("bcrypt");
const jwtDecode = require("jwt-decode");

const handleAsync = require("../../lib/handleAsync");
const jwtModule = require("../../lib/jwt");

const schema = yup.object().shape({
  username: yup.string().trim().min(2).max(100).required(),
  password: yup.string().min(4).max(100).required(),
});

const signup = handleAsync(async function signup(req, res) {
  const { password, username } = req.body;
  await schema.validate({ username, password }, { abortEarly: false });
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await req.models.User.create({
    username,
    password: hashedPassword,
  });

  const token = await jwtModule.signToken({
    id: user._id,
    username: user.username,
  });

  const decodedToken = jwtDecode(token);
  const expiresAt = decodedToken.exp;

  return res.status(201).json({
    data: { user: { username: user.username }, token, expiresAt },
  });
});

module.exports = signup;
