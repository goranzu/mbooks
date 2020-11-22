"use strict";

const knex = require("knex");
const config = require("./config");
const path = require("path");

const connection = knex({
  client: "pg",
  connection: {
    database: config.DB_NAME,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
  },
  migrations: {
    directory: path.join(process.cwd(), "db", "migrations"),
  },
  seeds: {
    directory: path.join(process.cwd(), "db", "seeds"),
  },
});

module.exports = connection;
