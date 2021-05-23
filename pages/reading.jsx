import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import {
  useGetAllBooksOnList,
  useAddBookToFinishedList,
  useDeleteBook,
} from "../lib/useBook";
import Button from "../components/button/Button";
import Spinner from "../components/loading-spinner/Spinner";
import { formatDate } from "../lib/formatDate";
import AuthCheck from "../components/AuthCheck";

export default function ReadingListPage() {
  const list = "reading";

  const {
    data: books,
    error: booksError,
    status: booksStatus,
  } = useGetAllBooksOnList(list);

  const { status: removeBookStatus, mutate: removeBookMutation } =
    useDeleteBook();

  const { status: markAsFinishedStatus, mutate: markAsFinishedMutation } =
    useAddBookToFinishedList();

  return (
    <AuthCheck>
      <Page>
        <Spinner show={booksStatus === "loading"} />
        {booksStatus === "error" && <p>{booksError.message}</p>}
        {booksStatus === "success" && (
          <BooksGrid>
            {books.data.data.books.length > 0 ? (
              books.data.data.books.map((book) => (
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
                      onClick={() =>
                        removeBookMutation({ googleId: book.googleId, list })
                      }
                      disabled={
                        removeBookStatus === "loading" ||
                        markAsFinishedStatus === "loading"
                      }
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        removeBookStatus === "loading" ||
                        markAsFinishedStatus === "loading"
                      }
                      onClick={() => {
                        markAsFinishedMutation(book.googleId);
                      }}
                    >
                      Finished
                    </Button>
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
