import React, { useContext, useState } from "react";
import ResultCard from "../../components/result-card/ResultCard";
import styles from "./search.module.css";
import { FetchContext } from "../../context/fetch";
import { useMutation } from "react-query";

function Search() {
  const [title, setTitle] = useState("Ender's Game");

  let books = [];

  const fetchContext = useContext(FetchContext);
  const [search, { status, data, error }] = useMutation(() =>
    fetchContext.authClient.get(`api/v1/search?title=${title}`),
  );

  if (status === "success") {
    books = data.data.data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    books = [];
    await search();
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

      {status === "error" && (
        <p>{JSON.stringify(error.response?.data.message, null, 2)}</p>
      )}
      <ul className={styles.results}>
        {status === "loading" && <p>Loading...</p>}
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
