import React from "react";
import styles from "./resultCard.module.css";

function ResultCard({ book }) {
  return (
    <li key={book.goodreads_id}>
      <div className={styles.card}>
        <div className={styles.card_image}>
          <img src={book.image_url} alt={`Cover for ${book.title}`} />
        </div>
        <div className={styles.card_text}>
          <p>{book.title}</p>
          <p className={styles.author}>
            by {book.author} &mdash; {book.publication_year}
          </p>
        </div>
      </div>
    </li>
  );
}

export default ResultCard;
