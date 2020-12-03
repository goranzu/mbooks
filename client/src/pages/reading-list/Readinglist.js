import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { FetchContext } from "../../context/fetch";

function ReadingList() {
  const fetchContext = useContext(FetchContext);
  const { status, data, error } = useQuery("readinglist", () => {
    return fetchContext.authClient.get("/api/v1/book?status=is_reading");
  });

  let books = [];

  if (status === "success") {
    books = data.data.data;
  }

  console.log(books);

  return (
    <div>
      <h1>Readinglist</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "success" && books.length === 0 ? (
        <p>
          Readinglist empty go to <Link to="/search">search</Link> to some books
        </p>
      ) : (
        books.map((b) => <p key={b.id}>{JSON.stringify(b, null, 2)}</p>)
      )}
      {status === "error" && JSON.stringify(error.response, null, 2)}
    </div>
  );
}

export default ReadingList;
