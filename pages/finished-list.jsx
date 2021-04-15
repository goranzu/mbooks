import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import { useGetBooksOnList, useRemoveBookFromList } from "../lib/useBook";
import { USER_FINISHED_LIST_QUERY_KEY } from "../lib/constants";

export default function FinishedListPage() {
  const LIST = "finishedList";
  const { data, error, status } = useGetBooksOnList({
    list: LIST,
    queryKey: USER_FINISHED_LIST_QUERY_KEY,
  });

  const { status: mutationSatus, mutate } = useRemoveBookFromList({
    list: LIST,
  });

  return (
    <Page>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>{error.message}</p>}
      {status === "success" ? (
        <BooksGrid>
          {data.data.data.finishedList.map((book) => (
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
