import nc from "next-connect";
import { onError } from "../../../lib/middlewares";
import { register } from "../../../lib/controllers/auth.controllers";

const handler = nc({ onError });

export default handler.post(register);
