"use strict";

const db = require("../../db/db");
const tableNames = require("../../constants/tableNames");

module.exports = {
  find() {
    return db(tableNames.book);
  },
};
