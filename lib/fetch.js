import axios from "axios";

export const publicFetch = axios.create({ baseURL: "/api" });

export const privateFetch = (context) =>
  axios.create({
    baseURL: "/api",
    headers: {
      cookie: context?.req?.headers?.cookie,
    },
  });
