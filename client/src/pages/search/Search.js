import React, { useState } from "react";
import styles from "./search.module.css";

const url = `${process.env.REACT_APP_API_URL}/api/v1/search`;

function Search() {
  const [title, setTitle] = useState("Ender's Game");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch(`${url}?title=${title}`);
    const { data } = await response.json();
    setIsLoading(false);
    setBooks(data);
  }
  return (
    <section className={`container ${styles.search}`}>
      <h1>Search Page</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="title">Search by title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          id="title"
        />
        <button type="submit">Search</button>
      </form>

      <ul className={styles.results}>
        {isLoading && <p>Loading...</p>}
        {books.length > 0
          ? books.map((book) => (
              <li key={book.goodreads_id}>
                <div>
                  <p>{book.title}</p>
                  <p>{book.author}</p>
                  <img src={book.image_url} alt={`Cover for ${book.title}`} />
                </div>
              </li>
            ))
          : null}
      </ul>
    </section>
  );
}

export default Search;
