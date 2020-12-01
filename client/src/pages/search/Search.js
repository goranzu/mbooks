import React, { useContext, useState } from "react";
import ResultCard from "../../components/result-card/ResultCard";
import styles from "./search.module.css";
import { FetchContext } from "../../context/fetch";

function Search() {
  const [title, setTitle] = useState("Ender's Game");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const fetchContext = useContext(FetchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrors([]);
      const { data } = await fetchContext.authClient.get(
        `api/v1/search?title=${title}`,
      );
      setIsLoading(false);
      setBooks(data.data);
    } catch (error) {
      setIsLoading(false);
      setErrors(error.response.data.message);
    }
  }
  return (
    <section className={`container ${styles.search}`}>
      <h1>Search Page</h1>
      {errors.length > 0 && <p>{errors[0]}</p>}
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
              <ResultCard key={book.goodreads_id} book={book} />
            ))
          : null}
      </ul>
    </section>
  );
}

export default Search;
