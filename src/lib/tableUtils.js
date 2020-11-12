"use strict";

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime("deleted_at");
}

module.exports = { addDefaultColumns };
