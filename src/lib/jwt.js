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

module.exports = { signToken };
