import { useRouter } from "next/router";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import BooksGrid from "../components/books-grid/BooksGrid";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import { AuthContext } from "../context/AuthContext";
import { USER_BOOKS_QUERY_KEY } from "../lib/constants";
import { useAddBookToList } from "../lib/useBook";
import { useSearch } from "../lib/useSearch";

export default function SearchPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const queryClient = useQueryClient();

  const usersBooks = queryClient.getQueryData(USER_BOOKS_QUERY_KEY);

  const { mutate, status, data } = useSearch();

  const { mutate: mutateBook, status: bookStatus } = useAddBookToList({
    list: "readingList",
    queryKey: USER_BOOKS_QUERY_KEY,
  });

  if (!authContext.isAuthenticated()) {
    router.push("/");
    return <></>;
  }

  function handleAddToReadingList(book) {
    mutateBook({
      goodreadsId: book.goodreadsId,
      title: book.title,
      authorName: book.author.name,
      imageUrl: book.imageUrl,
      averageRating: book.averageRating,
      publicationYear: book.publicationYear,
    });
  }

  return (
    <Page>
      <SearchForm handleSubmit={mutate} />
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Something went wrong please try again later</p>}
      {status === "success" ? (
        <BooksGrid>
          {data.data.data.books.map((book) => (
            <SearchCard
              key={book.goodreadsId}
              authorName={book.author?.name}
              title={book.title}
              imageUrl={book.imageUrl}
              publicationYear={Number(book.publicationYear)}
              averageRating={Number(book.averageRating)}
            >
              {!usersBooks?.includes(book.goodreadsId) ? (
                <button
                  disabled={bookStatus === "loading"}
                  onClick={() => handleAddToReadingList(book)}
                >
                  Add to reading list
                </button>
              ) : (
                <p style={{ fontWeight: "bold" }}>Already on reading list</p>
              )}
            </SearchCard>
          ))}
        </BooksGrid>
      ) : null}
    </Page>
  );
}
