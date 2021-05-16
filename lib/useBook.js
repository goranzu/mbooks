import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY } from "./constants";
import { privateFetch } from "./fetch";

function useAddNoteToBook(list) {
  return useMutation((data) =>
    privateFetch().post(`/books/${list}/note`, data),
  );
}

function useAddBookToReadingList() {
  const queryClient = useQueryClient();
  return useMutation(
    (book) => privateFetch().post("/books?list=reading", book),
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) => [
          ...old,
          data.data.googleId,
        ]);
      },
    },
  );
}

function useAddBookToFinishedList() {
  const queryClient = useQueryClient();
  return useMutation(
    (book) => privateFetch().post("/books?list=finished", book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["books", "reading"]);
        queryClient.invalidateQueries(["books", "finished"]);
      },
    },
  );
}

function useGetBooksOnList(list = "reading") {
  const resource = `/books/?list=${list}`;
  return useQuery(["books", list], () =>
    privateFetch()
      .get(resource)
      .then((res) => res.data.data.list),
  );
}

function useRemoveBookFromReadingList(list = "reading") {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id }) => privateFetch().delete(`/books/?list=${list}&id=${id}`),
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

function useGetBookDetails(id) {
  return useQuery(["book", id], async () => {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
    const response = await axios.get(url);
    return response.data;
  });
}

export {
  useAddBookToReadingList,
  useAddBookToFinishedList,
  useGetBooksOnList,
  useRemoveBookFromReadingList,
  useGetBookDetails,
  useAddNoteToBook,
};
