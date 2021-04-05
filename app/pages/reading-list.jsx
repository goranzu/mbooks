import axios from "axios";
import { useQuery } from "react-query";
import Page from "../components/Page";
import SearchCard from "../components/search-card/SearchCard";

export default function ReadingListPage() {
  // TODO: Bug when going from this page to search page
  const { data, error, status } = useQuery("readingList", () =>
    axios.get("/api/books"),
  );

  return (
    <Page>
      <h1>ReadingList</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>{error.message}</p>}
      {status === "success" &&
        data.data.data.readingList.map((book) => (
          <SearchCard
            authorName={book.authorName}
            averageRating={book.averageRating}
            imageUrl={book.imageUrl}
            publicationYear={book.publicationYear}
            title={book.title}
            key={book.id}
          />
        ))}
    </Page>
  );
}
