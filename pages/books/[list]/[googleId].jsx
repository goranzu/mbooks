import purify from "dompurify";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import Spinner from "../../../components/loading-spinner/Spinner";
import Page from "../../../components/page/Page";
import { useAuthContext } from "../../../context/AuthContext";
import { formatDate } from "../../../lib/formatDate";
import { useAddNoteToBook, useGetBookDetails } from "../../../lib/useBook";
import useForm from "../../../lib/useForm";
import styles from "../../../styles/detail.module.css";

export default function BookDetailsPage() {
  const authContext = useAuthContext();
  const router = useRouter();
  const { inputs, handleChange } = useForm({ note: "" });

  const { list, googleId } = router.query;
  const { data, status } = useGetBookDetails(googleId);
  const queryClient = useQueryClient();
  const usersBooks = queryClient.getQueryData("usersBooks");

  const { mutate: addNoteToBook } = useAddNoteToBook(list);

  if (!authContext.isAuthenticated()) {
    router.push("/");
    return <></>;
  }

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
        {status === "success" && usersBooks?.includes(googleId) && (
          <div className={styles.notes}>
            <p>Notes</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inputs.note) {
                  return;
                }

                const { note } = inputs;
                addNoteToBook({ note, googleId });
              }}
            >
              <textarea
                value={inputs.note}
                onChange={handleChange}
                name="note"
                id="note"
                rows="10"
              ></textarea>
              <button type="submit">Make Note</button>
            </form>
          </div>
        )}
      </section>
    </Page>
  );
}
