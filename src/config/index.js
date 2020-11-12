"use strict";

const { merge } = require("lodash");

const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  port: 3000,
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
