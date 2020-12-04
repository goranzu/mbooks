import React, { useContext } from "react";
import { queryCache, useMutation } from "react-query";
import { FetchContext } from "../../context/fetch";
import styles from "./resultCard.module.css";

function ResultCard({ book }) {
  const fetchContext = useContext(FetchContext);

  const [addBook, { status, error }] = useMutation((book) =>
    fetchContext.authClient.post(`api/v1/book`, book),
  );

  const [
    updateBookStatus,
    { status: updateStatus, error: updateError, data },
  ] = useMutation(
    (status) =>
      fetchContext.authClient.post(`api/v1/book/${book.id}`, { status }),
    {
      onSuccess: () => {
        queryCache.invalidateQueries("readinglist");
      },
    },
  );

  function addBookReadingList() {
    addBook(book);
  }

  async function removeBookFromReadingList() {
    await updateBookStatus("stopped_reading");
  }

  return (
    <li>
      <div className={styles.card}>
        <div className={styles.card_image}>
          <img src={book.image_url} alt={`Cover for ${book.title}`} />
        </div>
        <div className={styles.card_text}>
          <p className={styles.title}>{book.title}</p>
          <p className={styles.author}>
            by {book.author} &mdash; {book.publication_year}
          </p>
          {book.status === "is_reading" ? (
            <button
              onClick={removeBookFromReadingList}
              className={styles.list_button}
            >
              Stopped Reading
            </button>
          ) : (
            <button onClick={addBookReadingList} className={styles.list_button}>
              Add To List
            </button>
          )}
          {status === "error" && <p>{error.response.data.message[0]}</p>}
        </div>
      </div>
    </li>
  );
}

export default ResultCard;
