// Update with your config settings.

const config = require("./src/config");
const path = require("path");

module.exports = {
  development: {
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
  },
};
