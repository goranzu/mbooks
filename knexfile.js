// Update with your config settings.

const config = require("./src/config");

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: config.DB_NAME,
      user: config.DB_USERNAME,
      password: config.DB_PASSWORD,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
