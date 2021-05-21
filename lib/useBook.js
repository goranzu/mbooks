import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY } from "./constants";
import { privateFetch } from "./fetch";

function useGetAllBooks() {
  return useQuery(USER_BOOKS_QUERY_KEY, () =>
    privateFetch()
      .get("/books")
      .then((data) => data.data.data.books),
  );
}

function useAddNoteToBook(list) {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => privateFetch().post(`/books/${list}/note`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
      },
    },
  );
}

function useAddBookToReadingList() {
  const queryClient = useQueryClient();
  return useMutation(
    (book) => privateFetch().post("/books?list=reading", book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
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
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
      },
    },
  );
}

function useRemoveBookFromReadingList(list = "reading") {
  const queryClient = useQueryClient();
  return useMutation(
    ({ googleId }) =>
      privateFetch().delete(`/books/?list=${list}&id=${googleId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
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
  useRemoveBookFromReadingList,
  useGetBookDetails,
  useAddNoteToBook,
  useGetAllBooks,
};
