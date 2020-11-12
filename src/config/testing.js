"use strict";

const path = require("path");
require("dotenv-safe").config({ path: path.join(process.cwd(), ".env.test") });

module.exports = {
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
};
