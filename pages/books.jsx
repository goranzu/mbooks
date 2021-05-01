import { useRouter } from "next/router";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import {
  useGetBooksOnList,
  useRemoveBookFromReadingList,
} from "../lib/useBook";

export default function ReadingListPage() {
  const router = useRouter();
  const { list } = router.query;
  const { data, error, status } = useGetBooksOnList(list);
  const { status: mutationSatus, mutate } = useRemoveBookFromReadingList(list);

  return (
    <Page>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>{error.message}</p>}
      {status === "success" && (
        <BooksGrid>
          {data.length > 0 ? (
            data.map((book) => (
              <SearchCard
                authorName={book.authorName}
                averageRating={book.averageRating}
                imageUrl={book.imageUrl}
                publicationYear={book.publicationYear}
                title={book.title}
                key={book.id}
              >
                <button
                  onClick={() =>
                    mutate({ id: book.id, goodreadsId: book.goodreadsId })
                  }
                  disabled={mutationSatus === "loading"}
                >
                  Remove Book
                </button>
              </SearchCard>
            ))
          ) : (
            <p>Nothing here...</p>
          )}
        </BooksGrid>
      )}
    </Page>
  );
}
