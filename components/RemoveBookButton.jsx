import PropTypes from "prop-types";
import { useDeleteBook } from "../lib/useBook";
import Button from "./button/Button";

export default function RemoveBookButton({ list, googleId, ...props }) {
  const { mutateAsync: removeBookMutation, status: removeBookStatus } =
    useDeleteBook();

  return (
    <Button
      variant="delete"
      disabled={removeBookStatus === "loading"}
      onClick={() => {
        removeBookMutation({ googleId, list });
      }}
      {...props}
    >
      Remove
    </Button>
  );
}

RemoveBookButton.propTypes = {
  list: PropTypes.string,
  googleId: PropTypes.string,
  variant: PropTypes.string,
};
