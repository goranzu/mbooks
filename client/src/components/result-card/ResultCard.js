import React from "react";
import styles from "./resultCard.module.css";

function ResultCard({ book }) {
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
          <button className={styles.list_button}>Add To List</button>
        </div>
      </div>
    </li>
  );
}

export default ResultCard;
