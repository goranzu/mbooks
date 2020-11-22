"use strict";

"use strict";

const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
const db = require("../../db");
const schema = require("./book.schema.json");

class Book extends Model {
  static get tableName() {
    return tableNames.book;
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const User = require("../user/user.model");
    return {
      user: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "book.id",
          through: {
            from: "user_reading_log.book_id",
            to: "user_reading_log.user_id",
            extra: ["status"],
          },
          to: "user.id",
        },
      },
    };
  }
}

Book.knex(db);

module.exports = Book;
