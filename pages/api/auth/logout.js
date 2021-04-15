import nc from "next-connect";
import { logout } from "../../../lib/controllers/auth.controllers";
import { onError, protect } from "../../../lib/middlewares";

const handler = nc({ onError });

export default handler.use(protect).delete(logout);
