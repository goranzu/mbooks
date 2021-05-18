import { useRouter } from "next/router";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import {
  useGetBooksOnList,
  useRemoveBookFromReadingList,
  useAddBookToFinishedList,
} from "../lib/useBook";
import Button from "../components/button/Button";
import Spinner from "../components/loading-spinner/Spinner";
import { formatDate } from "../lib/formatDate";
import AuthCheck from "../components/AuthCheck";

export default function ReadingListPage() {
  const router = useRouter();
  const { list } = router.query;
  const { data, error, status } = useGetBooksOnList(list);
  const { status: mutationSatus, mutate } = useRemoveBookFromReadingList(list);
  const markAsFinished = useAddBookToFinishedList();

  return (
    <AuthCheck>
      <Page>
        <Spinner show={status === "loading"} />
        {status === "error" && <p>{error.message}</p>}
        {status === "success" && (
          <BooksGrid>
            {data.length > 0 ? (
              data.map((book) => (
                <SearchCard
                  authorName={book.authorName}
                  imageUrl={book.imageUrl}
                  publishedDate={formatDate(book.publishedDate)}
                  title={book.title}
                  key={book.id}
                  googleId={book.googleId}
                  list={list}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      onClick={() => mutate({ googleId: book.googleId })}
                      disabled={
                        mutationSatus === "loading" ||
                        markAsFinished.status === "loading"
                      }
                    >
                      Remove
                    </Button>
                    {router.asPath.includes("reading") && (
                      <Button
                        variant="outline"
                        disabled={
                          mutationSatus === "loading" ||
                          markAsFinished.status === "loading"
                        }
                        onClick={() => {
                          markAsFinished.mutate({
                            id: book.id,
                            googleId: book.googleId,
                          });
                        }}
                      >
                        Finished
                      </Button>
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
    </AuthCheck>
  );
}
