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

  static get relationMappings() {
    const Book = require("../book/book.model");
    return {
      book: {
        relation: Model.ManyToManyRelation,
        modelClass: Book,
        join: {
          from: "user.id",
          through: {
            from: "user_reading_log.user_id",
            to: "user_reading_log.book_id",
            extra: ["status"],
          },
          to: "book.id",
        },
      },
    };
  }
}

User.knex(db);

module.exports = User;
