"use strict";

require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  port: 5000,
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: "1d",
  },
};

module.exports = baseConfig;
