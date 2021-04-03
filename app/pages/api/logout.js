import nc from "next-connect";
import { onError } from "../../lib/middlewares";
import session from "../../lib/session";

const handler = nc({ onError });

export default handler.use(session).get((req, res) => {
  req.session.destroy();
  res.status(200).json({
    data: {
      isLoggedIn: false,
      user: null,
    },
  });
});
