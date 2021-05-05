import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import BooksGrid from "../components/books-grid/BooksGrid";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import SearchForm from "../components/search-form/SearchForm";
import { useAuthContext } from "../context/AuthContext";
import { USER_BOOKS_QUERY_KEY } from "../lib/constants";
import { useAddBookToReadingList } from "../lib/useBook";
import { useSearch } from "../lib/useSearch";

export default function SearchPage() {
  const authContext = useAuthContext();
  const router = useRouter();

  const queryClient = useQueryClient();

  const usersBooks = queryClient.getQueryData(USER_BOOKS_QUERY_KEY);

  const { mutate, status, data } = useSearch();

  const { mutate: mutateBook, status: bookStatus } = useAddBookToReadingList();

  if (!authContext.isAuthenticated()) {
    router.push("/");
    return <></>;
  }

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

  return (
    <Page>
      <SearchForm handleSubmit={mutate} />
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Something went wrong please try again later</p>}
      {status === "success" ? (
        <BooksGrid>
          {data.data.items.map(({ id, volumeInfo }) => (
            <SearchCard
              key={id}
              imageUrl={volumeInfo.imageLinks?.smallThumbnail}
              title={volumeInfo.title}
              publishedDate={volumeInfo.publishedDate}
              authorName={volumeInfo.authors ? volumeInfo.authors[0] : "unkown"}
              googleId={id}
            >
              {usersBooks.includes(id) ? (
                <p>On your list.</p>
              ) : (
                <button
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
                </button>
              )}
            </SearchCard>
          ))}
        </BooksGrid>
      ) : null}
    </Page>
  );
}
