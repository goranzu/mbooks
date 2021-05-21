import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import AuthCheck from "../../components/AuthCheck";
import BookDetail from "../../components/book-detail/BookDetatil";
import { BookNote } from "../../components/book-note/BookNote";
import Button from "../../components/button/Button";
import Spinner from "../../components/loading-spinner/Spinner";
import Page from "../../components/page/Page";
import { USER_BOOKS_QUERY_KEY } from "../../lib/constants";
import { useGetBookDetails } from "../../lib/useBook";
import styles from "../../styles/detail.module.css";

export default function BookDetailsPage() {
  const router = useRouter();

  const { params } = router.query;

  let list = null;
  let googleId = null;

  if (params[0] === "reading" || params[0] === "finished") {
    list = params[0];
    googleId = params[1];
  } else {
    googleId = params[0];
  }

  const { data, status } = useGetBookDetails(googleId);
  const queryClient = useQueryClient();
  const usersBooks = queryClient.getQueryData(USER_BOOKS_QUERY_KEY);

  const bookOnUsersList = usersBooks?.find(
    (book) => book.googleId === googleId,
  );

  let buttons = null;

  if (list === "reading") {
    buttons = (
      <>
        <Button>Finished reading</Button>
        <Button variant="outline">Remove</Button>
      </>
    );
  } else if (list === "finished") {
    buttons = <Button variant="outline">Remove</Button>;
  } else {
    buttons = <Button>Add to reading list</Button>;
  }

  /*
  If book is not on reading list option give them an option to add from this page
  {
    googleId,
    title,
    authorName,
    imageUrl,
    publishedDate,
  }

  and if it is on one of the list give them the option to remove
  */

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
              <div>{buttons}</div>
            </>
          )}
          {status === "success" && bookOnUsersList && (
            <BookNote
              googleId={googleId}
              list={list}
              defaultNote={bookOnUsersList.note}
            />
          )}
        </section>
      </Page>
    </AuthCheck>
  );
}
