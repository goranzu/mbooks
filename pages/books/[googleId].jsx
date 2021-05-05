import purify from "dompurify";
import { useRouter } from "next/router";
import Page from "../../components/page/Page";
import { useGetBookDetails } from "../../lib/useBook";

export default function BookDetailsPage() {
  const { query } = useRouter();

  const { data, status } = useGetBookDetails(query.googleId);

  return (
    <Page>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Something went wrong...</p>}
      {status === "success" && (
        <>
          <img
            src={data.volumeInfo.imageLinks?.smallThumbnail}
            alt={data.volumeInfo.title}
          />
          <h2>{data.volumeInfo.title}</h2>
          {data.volumeInfo.subtitle ? <p>{data.volumeInfo.subtitle}</p> : null}
          <small>by {data.volumeInfo.authors.join(", ")}</small>
          <br />
          <small>
            {data.volumeInfo.publishedDate
              ? new Date(data.volumeInfo.publishedDate).toLocaleDateString("nl")
              : null}
          </small>
          {data.volumeInfo.categories ? (
            <p>
              Genre: <em>{data.volumeInfo.categories[0]}</em>
            </p>
          ) : null}
          {data.volumeInfo.description ? (
            <p
              dangerouslySetInnerHTML={{
                __html: purify.sanitize(data.volumeInfo.description),
              }}
            />
          ) : null}
        </>
      )}
    </Page>
  );
}
