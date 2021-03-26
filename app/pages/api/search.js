import nc from "next-connect";
import axios from "axios";
import { onError } from "../../lib/middlewares";

const KEY = process.env.GOODREADS_KEY;

const URL = `https://www.goodreads.com/search/index.xml?key=${KEY}`;

const handler = nc({ onError });

export default handler.post(async (req, res) => {
  // TODO: Parse the XML response and return the data too client
  if (!req.body.title) {
    res.status(400).json({ error: { message: "Invalid input" } });
    return;
  }

  const response = await axios.get(`${URL}&q=${req.body.title}`);
  console.log(response);
  res.status(200).json({ data: { message: "hello world" } });
});
