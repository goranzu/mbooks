import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useAddBookToReadingList } from "../lib/useBook";
import Button from "./button/Button";
import { TOAST_ERROR_DEFAULT } from "../lib/constants";

export default function AddToReadingListButton({ book }) {
  const {
    mutateAsync: addBookToReadingListMutation,
    status: addBookToReadingListStatus,
  } = useAddBookToReadingList();

  return (
    <Button
      disabled={addBookToReadingListStatus === "loading"}
      onClick={async () => {
        try {
          await addBookToReadingListMutation(book);
          toast.success("Book added to reading list!");
        } catch (error) {
          toast.error(error.message || TOAST_ERROR_DEFAULT);
        }
      }}
    >
      Add to readinglist
    </Button>
  );
}

AddToReadingListButton.propTypes = {
  book: PropTypes.any,
};
