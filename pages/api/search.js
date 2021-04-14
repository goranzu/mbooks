import nc from "next-connect";
import axios from "axios";
import { onError, protect } from "../../lib/middlewares";
import xml2js from "xml2js";

const KEY = process.env.GOODREADS_KEY;
const URL = `https://www.goodreads.com/search/index.xml?key=${KEY}`;

const xmlParser = new xml2js.Parser();

const handler = nc({ onError });

export default handler.use(protect).post(async (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ error: { message: "Invalid input" } });
    return;
  }

  console.log(req.user);

  const response = await axios.get(`${URL}&q=${req.body.title}`);

  const parsedData = await xmlParser.parseStringPromise(response.data);

  const totalResults =
    parsedData.GoodreadsResponse.search[0]["total-results"][0];

  const formattedData = formatResponse(parsedData.GoodreadsResponse);

  res.status(200).json({ data: { totalResults, books: formattedData } });
});

function formatResponse(data = {}) {
  const searchData = data.search[0];

  const books = searchData.results[0].work.map((book) => {
    const bestBook = book.best_book[0];
    return {
      goodreadsId: bestBook.id[0]._,
      title: bestBook.title[0],
      author: {
        authorId: bestBook.author[0].id[0]._,
        name: bestBook.author[0].name[0],
      },
      // Regex changes the image url to remove size constraints. Matches _SY199_
      // imageUrl: bestBook.image_url[0].replace(/\._([^_]+)_(?=\.jpg$)/g, ""),
      imageUrl: bestBook.image_url[0],
      averageRating: book.average_rating[0],
      publicationYear: book.original_publication_year[0]._,
    };
  });

  return books;
}
