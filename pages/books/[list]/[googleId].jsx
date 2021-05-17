import purify from "dompurify";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import Button from "../../../components/button/Button";
import Spinner from "../../../components/loading-spinner/Spinner";
import Page from "../../../components/page/Page";
import { useAuthContext } from "../../../context/AuthContext";
import { formatDate } from "../../../lib/formatDate";
import { useAddNoteToBook, useGetBookDetails } from "../../../lib/useBook";
import styles from "../../../styles/detail.module.css";

export default function BookDetailsPage() {
  const authContext = useAuthContext();
  const router = useRouter();

  const { list, googleId } = router.query;
  const { data, status } = useGetBookDetails(googleId);
  const queryClient = useQueryClient();
  const usersBooks = queryClient.getQueryData("usersBooks");

  const bookOnUsersList = usersBooks?.find((book) => book.id === googleId);

  const { mutate: addNoteToBook, status: addNoteStatus } =
    useAddNoteToBook(list);

  if (!authContext.isAuthenticated()) {
    router.push("/");
    return <></>;
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
  console.log(data);

  return (
    <Page>
      <section className={styles.detail}>
        {status === "loading" && <Spinner />}
        {status === "error" && <p>Something went wrong...</p>}
        {status === "success" && (
          <>
            <div className={styles.header}>
              <img
                src={data.volumeInfo.imageLinks?.smallThumbnail}
                alt={data.volumeInfo.title}
              />
              <div className={styles.meta}>
                <h2>{data.volumeInfo.title}</h2>
                {data.volumeInfo.subtitle ? (
                  <p>{data.volumeInfo.subtitle}</p>
                ) : null}
                <small>by {data.volumeInfo.authors.join(", ")}</small>
                <br />
                <small>{formatDate(data.volumeInfo.publishedDate)}</small>
                {data.volumeInfo.categories ? (
                  <p>
                    Genre: <em>{data.volumeInfo.categories[0]}</em>
                  </p>
                ) : null}
              </div>
            </div>
            {data.volumeInfo.description ? (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: purify.sanitize(data.volumeInfo.description),
                }}
              />
            ) : null}
          </>
        )}
        {status === "success" && bookOnUsersList && (
          <div className={styles.notes}>
            <p>Notes</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const note = e.target.note.value;
                if (!note) {
                  return;
                }

                addNoteToBook({ note, googleId });
              }}
            >
              <textarea
                defaultValue={bookOnUsersList.note || ""}
                disabled={addNoteStatus === "loading"}
                name="note"
                id="note"
                rows="10"
              ></textarea>
              <Button type="submit">Make Note</Button>
              <Button variant="outline" type="button">
                Remove
              </Button>
            </form>
          </div>
        )}
      </section>
    </Page>
  );
}
