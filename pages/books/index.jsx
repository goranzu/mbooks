import { useRouter } from "next/router";
import Page from "../../components/page/Page";
import SearchCard from "../../components/search-card/SearchCard";
import BooksGrid from "../../components/books-grid/BooksGrid";
import {
  useRemoveBookFromList,
  useAddBookToFinishedList,
  useGetAllBooks,
} from "../../lib/useBook";
import Button from "../../components/button/Button";
import Spinner from "../../components/loading-spinner/Spinner";
import { formatDate } from "../../lib/formatDate";
import AuthCheck from "../../components/AuthCheck";
import { FINISHED_READING, PLAN_TO_READ } from "../../lib/constants";

export default function ListPage() {
  const router = useRouter();
  const { list } = router.query;
  const { data, error, status } = useGetAllBooks();

  const { status: removeBookStatus, mutate: removeBookMutation } =
    useRemoveBookFromList(list);

  const { status: markAsFinishedStatus, mutate: markAsFinishedMutation } =
    useAddBookToFinishedList();

  function filterBooksByStatus(book) {
    if (
      (book.status === PLAN_TO_READ && list === "reading") ||
      (book.status === FINISHED_READING && list === "finished")
    ) {
      return true;
    } else {
      return false;
    }
  }

  let books = [];
  if (status === "success") {
    books = data.filter(filterBooksByStatus);
  }

  return (
    <AuthCheck>
      <Page>
        <Spinner show={status === "loading"} />
        {status === "error" && <p>{error.message}</p>}
        {status === "success" && (
          <BooksGrid>
            {books.length > 0 ? (
              books.map((book) => (
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
                        removeBookMutation({ googleId: book.googleId })
                      }
                      disabled={
                        removeBookStatus === "loading" ||
                        markAsFinishedStatus === "loading"
                      }
                    >
                      Remove
                    </Button>
                    {router.asPath.includes("reading") && (
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
