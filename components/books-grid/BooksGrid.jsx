import PropTypes from "prop-types";
import styles from "./books-grid.module.css";

export default function BooksGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

BooksGrid.propTypes = {
  children: PropTypes.any,
};
