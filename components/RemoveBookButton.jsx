import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useRemoveBookFromList } from "../lib/useBook";
import Button from "./button/Button";

export default function RemoveBookButton({ list, googleId }) {
  const { mutateAsync: removeBookMutation, status: removeBookStatus } =
    useRemoveBookFromList(list);

  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => {
        removeBookMutation({ googleId });
        router.push(`/books/${googleId}`);
      }}
    >
      Remove
    </Button>
  );
}

RemoveBookButton.propTypes = {
  list: PropTypes.string,
  googleId: PropTypes.string,
};
