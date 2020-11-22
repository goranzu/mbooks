"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");

function signToken({ id, username, email }) {
  const payload = {
    sub: id,
    email,
    username,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.jwt.secret,
      {
        expiresIn: config.jwt.exp,
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      },
    );
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.jwt.secret,
      { ignoreExpiration: false },
      (err, payload) => {
        if (err) {
          return reject(err);
        }
        return resolve(payload);
      },
    );
  });
}

module.exports = { signToken, verifyToken };
