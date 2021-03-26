import { NextApiResponse } from "next";

function onError(err, _, res) {
  console.error(err);
  res.status(500).end("Something went wrong...");
}

export { onError };
