import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import BooksGrid from "../components/books-grid/BooksGrid";
import { useGetAllBooksOnList } from "../lib/useBook";
import Spinner from "../components/loading-spinner/Spinner";
import { formatDate } from "../lib/formatDate";
import AuthCheck from "../components/AuthCheck";
import RemoveBookButton from "../components/RemoveBookButton";

export default function FinishedListPage() {
  const list = "finished";

  const {
    data: books,
    error: booksError,
    status: booksStatus,
  } = useGetAllBooksOnList(list);

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
                >
                  <div>
                    <RemoveBookButton list={list} googleId={book.googleId} />
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
