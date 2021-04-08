import { useEffect } from "react";
import Router from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import queryClient from "./queryClient";

export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
} = {}) {
  // Check if user is loggedin
  const { data, isLoading } = useQuery(
    "user",
    () => axios.get("/api/user"),
    // TODO: Handle refetch bug
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData("user", data.data);
      },
      retry: false,
    },
  );

  useEffect(() => {
    if (!redirectTo || isLoading) return;
    const { isLoggedIn } = data?.data?.data || { isLoggedIn: false };
    if (
      (redirectTo && !redirectIfFound && !isLoggedIn) ||
      (redirectIfFound && isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [isLoading]);

  return { user: data?.data?.data?.user };
}
