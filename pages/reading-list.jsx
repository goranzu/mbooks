import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import {
  useGetBooksOnReadingList,
  useRemoveBookFromReadingList,
} from "../lib/useBook";

export default function ReadingListPage() {
  const { data, error, status } = useGetBooksOnReadingList();
  const { status: mutationSatus, mutate } = useRemoveBookFromReadingList();

  return (
    <Page>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>{error.message}</p>}
      {status === "success" ? (
        <BooksGrid>
          {data.data.data.readingList.map((book) => (
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
          ))}
        </BooksGrid>
      ) : null}
    </Page>
  );
}
