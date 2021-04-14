import { useMutation, useQuery, useQueryClient } from "react-query";
import Page from "../components/page/Page";
import SearchCard from "../components/search-card/SearchCard";
import { publicFetch } from "../lib/fetch";
import styles from "../styles/readinglistpage.module.css";
import {
  USER_BOOKS_QUERY_KEY,
  USER_READING_LIST_QUERY_KEY,
} from "../lib/constants";

export default function ReadingListPage() {
  const queryClient = useQueryClient();
  const { data, error, status } = useQuery(USER_READING_LIST_QUERY_KEY, () =>
    publicFetch.get("/books"),
  );

  const { status: mutationSatus, mutate } = useMutation(
    ({ id }) => publicFetch.delete(`/books/${id}`),
    {
      onSuccess: (_, { goodreadsId }) => {
        queryClient.refetchQueries(USER_READING_LIST_QUERY_KEY);
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, (old) =>
          old.filter((o) => o !== goodreadsId),
        );
      },
    },
  );

  return (
    <Page>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>{error.message}</p>}
      <main className={styles.main}>
        <h2>Your readinglist...</h2>
        <div className={styles.list}>
          {status === "success" &&
            data.data.data.readingList.map((book) => (
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
        </div>
      </main>
    </Page>
  );
}
