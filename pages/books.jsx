import { useRouter } from "next/router";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import {
  useGetBooksOnList,
  useRemoveBookFromReadingList,
  useAddBookToFinishedList,
} from "../lib/useBook";
import { useAuthContext } from "../context/AuthContext";

export default function ReadingListPage() {
  const authContext = useAuthContext();
  const router = useRouter();
  const { list } = router.query;
  const { data, error, status } = useGetBooksOnList(list);
  const { status: mutationSatus, mutate } = useRemoveBookFromReadingList(list);
  const markAsFinished = useAddBookToFinishedList();

  if (!authContext.isAuthenticated()) {
    router.push("/");
    return <></>;
  }

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
                <div>
                  <button
                    onClick={() =>
                      mutate({ id: book.id, goodreadsId: book.goodreadsId })
                    }
                    disabled={
                      mutationSatus === "loading" ||
                      markAsFinished.status === "loading"
                    }
                  >
                    Remove Book
                  </button>
                  {router.asPath.includes("reading") && (
                    <button
                      disabled={
                        mutationSatus === "loading" ||
                        markAsFinished.status === "loading"
                      }
                      onClick={() => {
                        markAsFinished.mutate({
                          id: book.id,
                          goodreadsId: book.goodreadsId,
                        });
                      }}
                    >
                      Finished Reading.
                    </button>
                  )}
                </div>
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