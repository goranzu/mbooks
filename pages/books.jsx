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
import Button from "../components/button/Button";

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
                imageUrl={book.imageUrl}
                publishedDate={book.publishedDate}
                title={book.title}
                key={book.id}
                googleId={book.googleId}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() =>
                      mutate({ id: book.id, googleId: book.googleId })
                    }
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
  );
}
