import { serialize } from "cookie";
import nc from "next-connect";
import { onError } from "../../lib/middlewares";

const handler = nc({ onError });

export default handler.delete((req, res) => {
  try {
    const cookie = serialize("cookie", "", {
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", cookie);
    res.status(204).json({ data: { message: "Logged Out" } });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: { message: "Something went wrong..." } });
  }
});
