import { ironSession } from "next-iron-session";

const session = ironSession({
  password: "yc74kYBPCFyWLxPjbBsbga4Zs80u7Ypp5gjkx", // TODO: Put in env variabel,
  cookieName: "cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});

export default session;
