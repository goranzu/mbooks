import { useQueryClient } from "react-query";
import AddToReadingListButton from "../components/AddToReadingButton";
import AuthCheck from "../components/AuthCheck";
import BooksGrid from "../components/books-grid/BooksGrid";
import Spinner from "../components/loading-spinner/Spinner";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import { formatDate } from "../lib/formatDate";
import { useGetAllBooks } from "../lib/useBook";
import { useSearch } from "../lib/useSearch";

export default function SearchPage() {
  const queryClient = useQueryClient();

  const { mutate: search, status } = useSearch();
  const searchResults = queryClient.getQueryData("searchResults");

  const { data: allBooks } = useGetAllBooks();

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
              const bookOnList = allBooks?.find((book) => book.googleId === id);
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
                >
                  {bookOnList ? (
                    <p>On your list.</p>
                  ) : (
                    <AddToReadingListButton
                      book={{
                        googleId: id,
                        title: volumeInfo.title,
                        authorName: volumeInfo.authors
                          ? volumeInfo.authors[0]
                          : "unkown",
                        imageUrl: volumeInfo.imageLinks?.smallThumbnail,
                        publishedDate: volumeInfo.publishedDate,
                      }}
                    />
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
