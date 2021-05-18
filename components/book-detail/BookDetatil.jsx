import purify from "dompurify";
import PropTypes from "prop-types";
import { formatDate } from "../../lib/formatDate";
import styles from "./book-detail.module.css";

export default function BookDetail({
  thumbnail,
  title,
  subtitle,
  description,
  authors,
  categories,
  publishedDate,
}) {
  return (
    <>
      <div className={styles.header}>
        <img src={thumbnail} alt={title} />
        <div className={styles.meta}>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
          <small>by {authors.join(", ")}</small>
          <br />
          <small>{formatDate(publishedDate)}</small>
          {categories ? (
            <p>
              Genre: <em>{categories[0]}</em>
            </p>
          ) : null}
        </div>
      </div>
      {description ? (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: purify.sanitize(description),
          }}
        />
      ) : null}
    </>
  );
}

BookDetail.propTypes = {
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  authors: PropTypes.array,
  categories: PropTypes.array,
  publishedDate: PropTypes.string,
};
