import { useRouter } from "next/router";
import AddToFinishedListButton from "../../components/AddToFinishedListButton";
import AddToReadingListButton from "../../components/AddToReadingButton";
import AuthCheck from "../../components/AuthCheck";
import BookDetail from "../../components/book-detail/BookDetatil";
import { BookNote } from "../../components/book-note/BookNote";
import Spinner from "../../components/loading-spinner/Spinner";
import Page from "../../components/page/Page";
import RemoveBookButton from "../../components/RemoveBookButton";
import { FINISHED_READING, PLAN_TO_READ } from "../../lib/constants";
import { useGetAllBooks, useGetBookDetails } from "../../lib/useBook";
import styles from "../../styles/detail.module.css";

export default function BookDetailsPage() {
  const router = useRouter();

  const { googleId } = router.query;

  const { data, status } = useGetBookDetails(googleId);

  const { data: allBooks } = useGetAllBooks();

  const bookOnUsersList = allBooks?.find((book) => book.googleId === googleId);

  console.log(bookOnUsersList);

  if (status === "success") {
    // Using var because to escape block scoping
    var {
      volumeInfo: {
        imageLinks,
        title,
        subtitle,
        description,
        authors,
        categories,
        publishedDate,
      },
    } = data;
  }

  const book = {
    googleId,
    title,
    authorName: authors ? authors[0] : "unkown",
    imageUrl: imageLinks?.smallThumbnail,
    publishedDate,
  };

  return (
    <AuthCheck>
      <Page>
        <section className={styles.detail}>
          <Spinner show={status === "loading"} />
          {status === "error" && <p>Something went wrong...</p>}
          {status === "success" && (
            <>
              <BookDetail
                thumbnail={imageLinks?.thumbnail}
                title={title}
                subtitle={subtitle}
                description={description}
                authors={authors}
                categories={categories}
                publishedDate={publishedDate}
              />
              {/* Ternary to render the correct buttons, checks the books current status */}
              {bookOnUsersList === undefined ? (
                <AddToReadingListButton book={book} />
              ) : bookOnUsersList.status === PLAN_TO_READ ? (
                <div>
                  <RemoveBookButton list="reading" googleId={googleId} />
                  <AddToFinishedListButton
                    style={{ marginLeft: "1em" }}
                    googleId={googleId}
                  />
                </div>
              ) : bookOnUsersList.status === FINISHED_READING ? (
                <RemoveBookButton list="finished" googleId={googleId} />
              ) : null}
            </>
          )}
          {status === "success" && bookOnUsersList && (
            <BookNote
              googleId={googleId}
              list={
                bookOnUsersList.status === PLAN_TO_READ
                  ? "reading"
                  : bookOnUsersList.status === FINISHED_READING
                  ? "finished"
                  : null
              }
              defaultNote={bookOnUsersList.note}
            />
          )}
        </section>
      </Page>
    </AuthCheck>
  );
}
