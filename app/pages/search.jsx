import useForm from "../lib/useForm";
import axios from "axios";
import { useMutation } from "react-query";
import Page from "../components/Page";

export default function SearchPage() {
  const { inputs, handleChange } = useForm({ title: "enders game" });

  const { mutate, status, data } = useMutation(() =>
    axios.post("/api/search", inputs),
  );

  console.log(status);
  console.log(data);

  return (
    <Page>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            if (!inputs.title) return;
            mutate();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <fieldset>
          <label htmlFor="title">
            Title
            <input
              value={inputs.title}
              onChange={handleChange}
              type="text"
              name="title"
              id="title"
            />
          </label>
          <button type="submit">Search</button>
        </fieldset>
      </form>
      <section>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && (
          <p>Something went wrong please try again later</p>
        )}
        {status === "success" &&
          data.data.data.books.map(
            ({
              title,
              goodreadsId,
              imageUrl,
              publicationYear,
              author,
              averageRating,
            }) => (
              <article key={goodreadsId}>
                <h2>{title}</h2>
                <img src={imageUrl} alt={title} />
                <p>Written by {author.name}</p>
                <p>Published in {publicationYear}</p>
                <p>rating: {averageRating}</p>
              </article>
            ),
          )}
      </section>
    </Page>
  );
}
