import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY } from "./constants";
import { publicFetch } from "./fetch";

export function useAddBookToReadingList() {
  const queryClient = useQueryClient();
  return useMutation((book) => publicFetch.post("/books?list=reading", book), {
    onSuccess: ({ data }) => {
      queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) => [
        ...old,
        data.data.googleId,
      ]);
    },
  });
}

export function useAddBookToFinishedList() {
  const queryClient = useQueryClient();
  return useMutation((book) => publicFetch.post("/books?list=finished", book), {
    onSuccess: () => {
      queryClient.invalidateQueries(["books", "reading"]);
      queryClient.invalidateQueries(["books", "finished"]);
    },
  });
}

export function useGetBooksOnList(list = "reading") {
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
      onSuccess: (_, { googleId }) => {
        queryClient.refetchQueries(["books", "reading"]);
        queryClient.refetchQueries(["books", "finished"]);
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) =>
          old.filter((o) => o !== googleId),
        );
      },
    },
  );
}
