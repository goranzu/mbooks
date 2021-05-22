import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAddBookToFinishedList } from "../lib/useBook";
import Button from "./button/Button";

export default function AddToFinishedListButton({ googleId }) {
  const {
    mutateAsync: addBookFinishedListMutation,
    status: addBookToFinishedListStatus,
  } = useAddBookToFinishedList();

  const router = useRouter();

  return (
    <Button
      onClick={() => {
        addBookFinishedListMutation(googleId);
        router.push(`/books/finished/${googleId}`);
      }}
    >
      Finished
    </Button>
  );
}

AddToFinishedListButton.propTypes = {
  googleId: PropTypes.string,
};
