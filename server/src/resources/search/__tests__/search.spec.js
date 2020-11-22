"use strict";

const fs = require("fs");
const path = require("path");
const {
  fetchDataFromGoodreadsApi,
  formatTheGoodreadsResponse,
} = require("../search.router");
const axios = require("axios");
const config = require("../../../config");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();

const pathToFile = path.join(__dirname, "goodreads_response.xml");
const xmlData = fs.readFileSync(pathToFile).toString();

jest.mock("axios");
const url = `https://www.goodreads.com/search/index.xml?key=${config.goodreadsKey}&q=Enders Game`;

describe("GET books from goodreads", () => {
  test("should return xml when hitting the goodreads api", async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: xmlData }));
    await expect(fetchDataFromGoodreadsApi(url)).resolves.toEqual(xmlData);
    expect(axios.get).toHaveBeenCalledWith(
      `https://www.goodreads.com/search/index.xml?key=${config.goodreadsKey}&q=Enders Game`,
    );
  });
});

describe("Format the goodreads response", () => {
  test("should return the books in a formatted array", async () => {
    const parsedResponse = await parser.parseStringPromise(xmlData);
    const books = formatTheGoodreadsResponse(parsedResponse);
    expect(books[0]).toEqual({
      goodreads_id: "375802",
      title: "Ender's Game (Ender's Saga, #1)",
      author: "Orson Scott Card",
      image_url:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1408303130l/375802._SY160_.jpg",
      average_rating: "4.30",
      publication_year: "1985",
    });
  });
});
