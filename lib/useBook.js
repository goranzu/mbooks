import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY, USER_READING_LIST_QUERY_KEY } from "./constants";
import { publicFetch } from "./fetch";

export function useAddBookToList({ list, queryKey }) {
  const queryClient = useQueryClient();
  return useMutation((book) => publicFetch.post(`/books?list=${list}`, book), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.setQueryData(queryKey, (old) => [
        ...old,
        data.data.goodreadsId,
      ]);
    },
  });
}

export function useGetBooksOnList({ list, queryKey }) {
  return useQuery(queryKey, () => publicFetch.get(`/books?list=${list}`));
}

export function useRemoveBookFromList({ list }) {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) => publicFetch.delete(`/books/${id}?list=${list}`),
    {
      onSuccess: (_, { goodreadsId }) => {
        queryClient.refetchQueries(USER_READING_LIST_QUERY_KEY);
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) =>
          old.filter((o) => o !== goodreadsId),
        );
      },
    },
  );
}
