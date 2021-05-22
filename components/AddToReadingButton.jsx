import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAddBookToReadingList } from "../lib/useBook";
import Button from "./button/Button";

export default function AddToReadingListButton({ book }) {
  const {
    mutateAsync: addBookToReadingListMutation,
    status: addBookToReadingListStatus,
  } = useAddBookToReadingList();

  const router = useRouter();
  return (
    <Button
      onClick={() => {
        addBookToReadingListMutation(book);
        router.push(`/books/reading/${book.googleId}`);
      }}
    >
      Add to readinglist
    </Button>
  );
}

AddToReadingListButton.propTypes = {
  book: PropTypes.any,
};
