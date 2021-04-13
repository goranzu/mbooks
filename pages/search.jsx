import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/searchpage.module.css";

export default function SearchPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const { mutate, status, data } = useMutation((inputs) =>
    axios.post("/api/search", inputs),
  );

  const { mutate: mutateBook, status: bookStatus } = useMutation((book) =>
    axios.post("/api/books", book),
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
              <button onClick={() => handleAddToReadingList(book)}>
                Add to reading list
              </button>
            </SearchCard>
          ))}
      </section>
    </Page>
  );
}
