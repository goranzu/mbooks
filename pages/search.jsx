import axios from "axios";
import { useMutation } from "react-query";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import useUser from "../lib/useUser";
import styles from "../styles/searchpage.module.css";

export default function SearchPage() {
  // const { user } = useUser({ redirectTo: "/" });

  // const { mutate, status, data } = useMutation((inputs) =>
  //   axios.post("/api/search", inputs),
  // );

  // const { mutate: mutateBook, status: bookStatus } = useMutation((book) =>
  //   axios.post("/api/books", book),
  // );

  // // Prevent flash of unauthenticated content
  // if (user == null) {
  //   return <p></p>;
  // }

  // function handleAddToReadingList(book) {
  //   mutateBook({
  //     goodreadsId: book.goodreadsId,
  //     title: book.title,
  //     authorName: book.author.name,
  //     imageUrl: book.imageUrl,
  //     averageRating: book.averageRating,
  //     publicationYear: book.publicationYear,
  //   });
  // }

  // if (status === "success") {
  //   console.log(data.data.data.books);
  // }

  return (
    <Page>
      {/* <SearchForm handleSubmit={mutate} /> */}
      <SearchForm />
      {/* <section className={styles.results}>
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
      </section> */}
    </Page>
  );
}
