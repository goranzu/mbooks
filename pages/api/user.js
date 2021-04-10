import nc from "next-connect";
import { onError } from "../../lib/middlewares";
import session from "../../lib/session";

const handler = nc({ onError });

export default handler.use(session).get(async (req, res) => {
  const user = req.session.get("user");

  if (user == null) {
    res.status(401).json({ data: { isLoggedIn: false } });
    return;
  }

  res.status(200).json({ data: { isLoggedIn: true, user: { ...user } } });
});
