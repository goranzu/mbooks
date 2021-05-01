import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY, USER_READING_LIST_QUERY_KEY } from "./constants";
import { publicFetch } from "./fetch";

export function useAddBookToReadingList() {
  const queryClient = useQueryClient();
  return useMutation((book) => publicFetch.post("/books?list=reading", book), {
    onSuccess: ({ data }) => {
      queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) => [
        ...old,
        data.data.goodreadsId,
      ]);
    },
  });
}

export function useGetBooksOnList(list = "reading") {
  //   const resource = list === "reading" ? "/reading-list" : "/finished-list";
  const resource = `/books/?list=${list}`;
  return useQuery(["books", list], () =>
    publicFetch.get(resource).then((res) => res.data.data.list),
  );
}

export function useRemoveBookFromReadingList(list = "reading") {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) => publicFetch.delete(`/books/?list=${list}&id=${id}`),
    {
      onSuccess: (_, { goodreadsId }) => {
        queryClient.refetchQueries(["books", "reading"]);
        queryClient.refetchQueries(["books", "finished"]);
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) =>
          old.filter((o) => o !== goodreadsId),
        );
      },
    },
  );
}
