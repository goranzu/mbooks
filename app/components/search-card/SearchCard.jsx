import PropTypes from "prop-types";
import styles from "./search-card.module.css";

export default function SearchCard({
  goodreadsId,
  title,
  imageUrl,
  authorName,
  publicationYear,
  averageRating,
}) {
  return (
    <article className={`${styles.card} center`} key={goodreadsId}>
      <img src={imageUrl} alt={title} />
      <section className={styles.text}>
        <header>
          <h2 className="fs-500">{title}</h2>
          <small>({publicationYear})</small>
        </header>
        <p>Written by {authorName}</p>
        <p>rating: {averageRating}</p>
      </section>
    </article>
  );
}

SearchCard.propTypes = {
  goodreadsId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  authorName: PropTypes.string.isRequired,
  publicationYear: PropTypes.string,
  averageRating: PropTypes.string,
};
