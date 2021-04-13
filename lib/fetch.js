import axios from "axios";

export const publicFetch = axios.create({ baseURL: "/api" });

export const privateFetch = (context) =>
  axios.create({
    baseURL: "/api",
    headers:
      context &&
      context.req &&
      context.req.headers &&
      context.req.headers.cookie
        ? { cookie: context.req.heades.cookie }
        : undefined,
  });
