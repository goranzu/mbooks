import React, { useContext } from "react";
import { useMutation } from "react-query";
import { FetchContext } from "../../context/fetch";
import styles from "./resultCard.module.css";

function ResultCard({ book }) {
  const fetchContext = useContext(FetchContext);

  const [addBook, { status, error }] = useMutation((book) =>
    fetchContext.authClient.post(`api/v1/book`, book),
  );

  function addBookReadingList() {
    addBook(book);
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
          <button onClick={addBookReadingList} className={styles.list_button}>
            Add To List
          </button>
          {status === "error" && <p>{error.response.data.message[0]}</p>}
        </div>
      </div>
    </li>
  );
}

export default ResultCard;
