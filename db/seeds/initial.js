"use strict";

// eslint-disable-next-line no-unused-vars
const Knex = require();
const tableNames = require("../../src/constants/tableNames");

/**
 * @param {Knex} knex
 */
exports.seed = async function (knex) {
  await Promise.all(
    [tableNames.userReadingLog, tableNames.book, tableNames.user].map((t) =>
      knex(t).del(),
    ),
  );
};
