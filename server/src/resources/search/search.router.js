"use strict";

const { Router } = require("express");
const axios = require("axios").default;
const config = require("../../config");
const xml2js = require("xml2js");

const searchRouter = Router();
const parser = new xml2js.Parser();

async function fetchDataFromGoodreadsApi(url) {
  const { data } = await axios.get(url);
  return data;
}

function formatTheGoodreadsResponse(d) {
  const data = d?.GoodreadsResponse?.search[0];
  // eslint-disable-next-line no-unused-vars
  const totalResults = data["total-results"];
  const results = data?.results[0]?.work;
  const books = results.map((b) => {
    const book = b["best_book"][0];
    return {
      goodreads_id: book?.id[0]._,
      title: book.title[0],
      author: book["author"][0].name[0],
      publication_year: b["original_publication_year"][0]._,
      average_rating: b["average_rating"][0],
      image_url: book["image_url"][0],
    };
  });

  return books;
}

async function search(req) {
  const { title } = req.query;
  const url = `https://www.goodreads.com/search/index.xml?key=${config.goodreadsKey}&q=${title}`;
  const data = await fetchDataFromGoodreadsApi(url);
  const parsedData = await parser.parseStringPromise(data);
  const books = formatTheGoodreadsResponse(parsedData);
  return books;
}

searchRouter.get("/", async (req, res, next) => {
  try {
    const data = await search(req);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  searchRouter,
  fetchDataFromGoodreadsApi,
  formatTheGoodreadsResponse,
};