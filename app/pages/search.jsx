import axios from "axios";
import { useMutation } from "react-query";
import Page from "../components/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";

export default function SearchPage() {
  const { mutate, status, data } = useMutation((inputs) =>
    axios.post("/api/search", inputs),
  );

  return (
    <Page>
      <SearchForm handleSubmit={mutate} />
      <section>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && (
          <p>Something went wrong please try again later</p>
        )}
        {status === "success" &&
          data.data.data.books.map(
            ({
              title,
              goodreadsId,
              imageUrl,
              publicationYear,
              author,
              averageRating,
            }) => (
              <SearchCard
                key={goodreadsId}
                authorName={author?.name}
                title={title}
                goodreadsId={goodreadsId}
                imageUrl={imageUrl}
                publicationYear={publicationYear}
                averageRating={averageRating}
              />
            ),
          )}
      </section>
    </Page>
  );
}
