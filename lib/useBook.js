import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY } from "./constants";
import { privateFetch } from "./fetch";

function useGetAllBooks() {
  return useQuery(
    USER_BOOKS_QUERY_KEY,
    () =>
      privateFetch()
        .get("/books")
        .then((data) => data.data.data.books),
    {
      onSuccess: () => {},
    },
  );
}

function useGetAllBooksOnList(list) {
  return useQuery(list, () => privateFetch().get(`/${list}`));
}

function useAddNoteToBook(list) {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => privateFetch().put(`/books/${list}/${data.googleId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
      },
    },
  );
}

function useAddBookToReadingList() {
  const queryClient = useQueryClient();
  return useMutation((book) => privateFetch().post("/reading", book), {
    onSuccess: () => {
      queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
      queryClient.invalidateQueries("reading");
      queryClient.invalidateQueries("finished");
    },
  });
}

function useAddBookToFinishedList() {
  const queryClient = useQueryClient();
  return useMutation(
    (googleId) => privateFetch().post("/finished", { googleId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
        queryClient.invalidateQueries("reading");
        queryClient.invalidateQueries("finished");
      },
    },
  );
}

function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ googleId, list }) => privateFetch().delete(`/books/${list}/${googleId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_BOOKS_QUERY_KEY);
        queryClient.invalidateQueries("reading");
        queryClient.invalidateQueries("finished");
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
  useDeleteBook,
  useGetBookDetails,
  useAddNoteToBook,
  useGetAllBooks,
  useGetAllBooksOnList,
};
