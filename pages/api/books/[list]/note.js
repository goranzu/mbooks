import nc from "next-connect";
import { UserInputError } from "../../../../lib/errors";
import { onError, protect } from "../../../../lib/middlewares";

const handler = nc({ onError });

export default handler.use(protect).post((req, res, next) => {
  const { note, googleId } = req.body;
  const { list } = req.query;

  if (!note || !googleId || !list) {
    throw new UserInputError();
  }

  console.log();
  console.log(note, googleId, list);

  // Need bookID, list, and userID

  res.status(200).end();
});
