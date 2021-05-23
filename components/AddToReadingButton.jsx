import PropTypes from "prop-types";
import { useAddBookToReadingList } from "../lib/useBook";
import Button from "./button/Button";

export default function AddToReadingListButton({ book }) {
  const {
    mutateAsync: addBookToReadingListMutation,
    status: addBookToReadingListStatus,
  } = useAddBookToReadingList();

  return (
    <Button
      disabled={addBookToReadingListStatus === "loading"}
      onClick={() => {
        addBookToReadingListMutation(book);
      }}
    >
      Add to readinglist
    </Button>
  );
}

AddToReadingListButton.propTypes = {
  book: PropTypes.any,
};
