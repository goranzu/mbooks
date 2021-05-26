import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useAddBookToFinishedList } from "../lib/useBook";
import Button from "./button/Button";
import { TOAST_ERROR_DEFAULT } from "../lib/constants";

export default function AddToFinishedListButton({ googleId, ...props }) {
  const {
    mutateAsync: addBookFinishedListMutation,
    status: addBookToFinishedListStatus,
  } = useAddBookToFinishedList();

  return (
    <Button
      disabled={addBookToFinishedListStatus === "loading"}
      onClick={async () => {
        try {
          await addBookFinishedListMutation(googleId);
          toast.success("Marked as finished!");
        } catch (error) {
          toast.error(error.message || TOAST_ERROR_DEFAULT);
        }
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
