import { useRouter } from "next/router";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import { AuthContext } from "../context/AuthContext";
import { USER_BOOKS_QUERY_KEY } from "../lib/constants";
import { publicFetch } from "../lib/fetch";
import styles from "../styles/searchpage.module.css";

export default function SearchPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const queryClient = useQueryClient();

  const usersBooks = queryClient.getQueryData(USER_BOOKS_QUERY_KEY);

  const { mutate, status, data } = useMutation((inputs) =>
    publicFetch.post("/search", inputs),
  );

  const { mutate: mutateBook, status: bookStatus } = useMutation(
    (book) => publicFetch.post("/books", book),
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) => [
          ...old,
          data.data.goodreadsId,
        ]);
      },
    },
  );

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
      <section className={styles.results}>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && (
          <p>Something went wrong please try again later</p>
        )}
        {status === "success" &&
          data.data.data.books.map((book) => (
            <SearchCard
              key={book.goodreadsId}
              authorName={book.author?.name}
              title={book.title}
              imageUrl={book.imageUrl}
              publicationYear={Number(book.publicationYear)}
              averageRating={Number(book.averageRating)}
            >
              {!usersBooks.includes(book.goodreadsId) ? (
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
      </section>
    </Page>
  );
}
