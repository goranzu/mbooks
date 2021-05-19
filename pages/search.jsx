import { useQueryClient } from "react-query";
import AuthCheck from "../components/AuthCheck";
import BooksGrid from "../components/books-grid/BooksGrid";
import Button from "../components/button/Button";
import Spinner from "../components/loading-spinner/Spinner";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import { USER_BOOKS_QUERY_KEY } from "../lib/constants";
import { formatDate } from "../lib/formatDate";
import { useAddBookToReadingList } from "../lib/useBook";
import { useSearch } from "../lib/useSearch";

export default function SearchPage() {
  const queryClient = useQueryClient();

  // Get the id's to check if some of the search results are already on one of the lists
  let usersBooks = queryClient.getQueryData(USER_BOOKS_QUERY_KEY);
  // usersBooks = usersBooks?.map((book) => book.id);

  const { mutate: search, status } = useSearch();
  const searchResults = queryClient.getQueryData("searchResults");

  const { mutate: mutateBook, status: bookStatus } = useAddBookToReadingList();

  function handleAddToReadingList({
    googleId,
    title,
    authorName,
    imageUrl,
    publishedDate,
  }) {
    mutateBook({
      googleId,
      title,
      authorName,
      imageUrl,
      publishedDate,
    });
  }

  console.log(usersBooks);
  console.log(searchResults);

  return (
    <AuthCheck>
      <>
        <Page>
          <SearchForm onSearch={search} />
          <Spinner show={status === "loading"} />
          {status === "error" && (
            <p>Something went wrong please try again later</p>
          )}
          <BooksGrid>
            {searchResults?.map(({ id, volumeInfo }) => {
              const bookOnList = usersBooks?.find((book) => book.id === id);
              return (
                <SearchCard
                  key={id}
                  imageUrl={volumeInfo.imageLinks?.smallThumbnail}
                  title={volumeInfo.title}
                  publishedDate={formatDate(volumeInfo.publishedDate)}
                  authorName={
                    volumeInfo.authors ? volumeInfo.authors[0] : "unkown"
                  }
                  googleId={id}
                  list={
                    bookOnList?.status === "PLAN_TO_READ"
                      ? "reading"
                      : "finished"
                  }
                >
                  {bookOnList ? (
                    <p>On your list.</p>
                  ) : (
                    <Button
                      disabled={bookStatus === "loading"}
                      onClick={() => {
                        handleAddToReadingList({
                          googleId: id,
                          title: volumeInfo.title,
                          authorName: volumeInfo.authors
                            ? volumeInfo.authors[0]
                            : "unkown",
                          imageUrl: volumeInfo.imageLinks?.smallThumbnail,
                          publishedDate: volumeInfo.publishedDate,
                        });
                      }}
                    >
                      Add to reading list
                    </Button>
                  )}
                </SearchCard>
              );
            })}
          </BooksGrid>
        </Page>
      </>
    </AuthCheck>
  );
}
