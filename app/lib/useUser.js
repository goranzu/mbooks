import { useEffect } from "react";
import Router from "next/router";
// import { useQuery } from "react-query";
// import axios from "axios";
import queryClient from "./queryClient";

export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
} = {}) {
  // Check if user is loggedin

  // const { data, isLoading } = useQuery(
  //   "user",
  //   () => axios.get("/api/user"),
  //   // TODO: Handle refetch bug
  // );

  const user = queryClient.getQueryData("user");

  useEffect(() => {
    if (!redirectTo) return;

    const { isLoggedIn } = user || {};

    if (
      (redirectTo && !redirectIfFound && !isLoggedIn) ||
      (redirectIfFound && isLoggedIn)
    ) {
      // Router.push(redirectTo);
      Router.replace(redirectTo);
    }
  }, []);

  return { user };

  // useEffect(() => {
  //   if (!redirectTo || isLoading) return;

  //   const { isLoggedIn } = data.data.data;

  //   if (
  //     (redirectTo && !redirectIfFound && !isLoggedIn) ||
  //     (redirectIfFound && isLoggedIn)
  //   ) {
  //     Router.push(redirectTo);
  //   }
  // }, [isLoading]);

  // return { user: data?.data?.data?.user };
}
