"use strict";
// eslint-disable-next-line no-unused-vars
const Knex = require("knex");

const tableNames = require("../../src/constants/tableNames");

const { addDefaultColumns } = require("../../src/lib/tableUtils");

/**
 * @param {Knex} knex
 */
exports.up = async function (knex) {
  await Promise.all([
    await knex.schema.createTable(tableNames.user, (table) => {
      table.increments().notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("username").notNullable();
      table.string("password", 120).notNullable();
      table.datetime("last_login");

      addDefaultColumns(table);
    }),

    await knex.schema.createTable(tableNames.book, (table) => {
      table.increments().notNullable();
      table.string("goodreads_id").unique().notNullable();
      table.string("title").notNullable();
      table.string("author").notNullable();
      table.string("description", 1000);
      table.string("image_url", 2000);
      table.string("average_rating");
      table.string("publication_year", 4);
      addDefaultColumns(table);
    }),
  ]);

  await knex.schema.createTable(tableNames.userReadingLog, (table) => {
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("cascade");
    table
      .integer("book_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("book")
      .onDelete("cascade");
    table
      .enum("status", [
        "plans_to_read",
        "is_reading",
        "has_read",
        "stopped_reading",
      ])
      .notNullable()
      .defaultTo("is_reading");
    table.primary(["user_id", "book_id", "status"]);
    addDefaultColumns(table);
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async function (knex) {
  await Promise.all(
    [tableNames.userReadingLog, tableNames.user, tableNames.book].map((t) =>
      knex.schema.dropTable(t),
    ),
  );
};
