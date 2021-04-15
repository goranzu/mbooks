import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import {
  useAddBookToList,
  useGetBooksOnList,
  useRemoveBookFromList,
} from "../lib/useBook";
import {
  USER_BOOKS_QUERY_KEY,
  USER_READING_LIST_QUERY_KEY,
} from "../lib/constants";

export default function ReadingListPage() {
  const LIST = "readingList";
  const { data, error, status } = useGetBooksOnList({
    list: LIST,
    queryKey: USER_READING_LIST_QUERY_KEY,
  });

  const { status: mutationSatus, mutate } = useRemoveBookFromList({
    list: LIST,
  });

  const {
    status: markAsFinishedStatus,
    mutate: markAsFinished,
  } = useAddBookToList({
    list: "finishedList",
    queryKey: USER_BOOKS_QUERY_KEY,
  });

  const isDisabled =
    mutationSatus === "loading" || markAsFinishedStatus === "loading";

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
                // disabled={mutationSatus === "loading"}
                disabled={isDisabled}
              >
                Remove Book
              </button>
              <button
                disabled={isDisabled}
                onClick={() => markAsFinished(book)}
              >
                Mark as finished
              </button>
            </SearchCard>
          ))}
        </BooksGrid>
      ) : null}
    </Page>
  );
}
