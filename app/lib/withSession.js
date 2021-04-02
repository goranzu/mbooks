import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
  return withIronSession(handler, {
    password: "msHyBDMm3p1sMPspn9vv", // TODO: Put in env variabel,
    cookieName: "auth-cookie",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
