import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useAddNoteToBook } from "../../lib/useBook";
import Button from "../button/Button";
import styles from "./book-note.module.css";

export function BookNote({ googleId, list, defaultNote }) {
  const { mutateAsync: addNoteToBook, status: addNoteStatus } =
    useAddNoteToBook(list);

  const isDisabled = addNoteStatus === "loading";

  return (
    <div className={styles.note}>
      <p>Notes</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const note = e.target.note.value;
          if (!note) {
            return;
          }

          try {
            await addNoteToBook({ note, googleId });
            toast.success("Note Added!");
          } catch (error) {
            toast.error(error.message || "Something went wrong!");
          }
        }}
      >
        <textarea
          defaultValue={defaultNote || ""}
          disabled={isDisabled}
          name="note"
          id="note"
          rows="10"
        ></textarea>
        <Button disabled={isDisabled} type="submit">
          Make Note
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
