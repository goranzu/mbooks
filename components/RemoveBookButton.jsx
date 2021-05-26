import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useDeleteBook } from "../lib/useBook";
import Button from "./button/Button";
import { TOAST_ERROR_DEFAULT } from "../lib/constants";

export default function RemoveBookButton({ list, googleId, ...props }) {
  const { mutateAsync: removeBookMutation, status: removeBookStatus } =
    useDeleteBook();

  return (
    <Button
      variant="delete"
      disabled={removeBookStatus === "loading"}
      onClick={async () => {
        try {
          await removeBookMutation({ googleId, list });
          toast.success("Book removed!");
        } catch (error) {
          toast.error(error.message || TOAST_ERROR_DEFAULT);
        }
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
