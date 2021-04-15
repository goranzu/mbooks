import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY, USER_READING_LIST_QUERY_KEY } from "./constants";
import { publicFetch } from "./fetch";

export function useAddBookToReadingList() {
  const queryClient = useQueryClient();
  return useMutation((book) => publicFetch.post("/reading-list", book), {
    onSuccess: ({ data }) => {
      queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) => [
        ...old,
        data.data.goodreadsId,
      ]);
    },
  });
}

export function useGetBooksOnReadingList() {
  return useQuery(USER_READING_LIST_QUERY_KEY, () =>
    publicFetch.get("/reading-list"),
  );
}

export function useRemoveBookFromReadingList() {
  const queryClient = useQueryClient();
  return useMutation(({ id }) => publicFetch.delete(`/reading-list/${id}`), {
    onSuccess: (_, { goodreadsId }) => {
      queryClient.refetchQueries(USER_READING_LIST_QUERY_KEY);
      queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) =>
        old.filter((o) => o !== goodreadsId),
      );
    },
  });
}
