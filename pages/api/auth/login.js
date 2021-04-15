import nc from "next-connect";
import { onError } from "../../../lib/middlewares";
import { login } from "../../../lib/controllers/auth.controllers";

const handler = nc({ onError });

export default handler.post(login);
