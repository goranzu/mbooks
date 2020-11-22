"use strict";

require("dotenv-safe").config();
const { merge } = require("lodash");

const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  port: 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: "1d",
  },
};

let config;

switch (env) {
  case "dev":
  case "development":
    config = require("./dev");
    break;
  case "test":
  case "testing":
    config = require("./testing");
    break;
  default:
    config = require("./dev");
}

module.exports = merge(baseConfig, config);
