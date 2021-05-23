import PropTypes from "prop-types";
import { useAddBookToFinishedList } from "../lib/useBook";
import Button from "./button/Button";

export default function AddToFinishedListButton({ googleId, ...props }) {
  const {
    mutateAsync: addBookFinishedListMutation,
    status: addBookToFinishedListStatus,
  } = useAddBookToFinishedList();

  return (
    <Button
      disabled={addBookToFinishedListStatus === "loading"}
      onClick={() => {
        addBookFinishedListMutation(googleId);
      }}
      {...props}
    >
      Finished
    </Button>
  );
}

AddToFinishedListButton.propTypes = {
  googleId: PropTypes.string,
};
