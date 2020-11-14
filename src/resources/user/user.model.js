"use strict";

const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
const db = require("../../db");
const schema = require("./user.schema.json");

class User extends Model {
  static get tableName() {
    return tableNames.user;
  }

  static get jsonSchema() {
    return schema;
  }
}

User.knex(db);

module.exports = User;
