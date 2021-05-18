import PropTypes from "prop-types";
import { useAddNoteToBook } from "../../lib/useBook";
import Button from "../button/Button";
import styles from "./book-note.module.css";

export function BookNote({ googleId, list, defaultNote }) {
  const { mutate: addNoteToBook, status: addNoteStatus } =
    useAddNoteToBook(list);

  return (
    <div className={styles.note}>
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
          defaultValue={defaultNote || ""}
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
  );
}

BookNote.propTypes = {
  googleId: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
  defaultNote: PropTypes.string.isRequired,
};
