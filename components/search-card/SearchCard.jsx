import PropTypes from "prop-types";
import styles from "./search-card.module.css";

export default function SearchCard({
  title,
  imageUrl,
  authorName,
  publicationYear,
  averageRating,
  children,
}) {
  return (
    <article className={`${styles.card} center fs-100`}>
      <img src={imageUrl} alt={title} />
      <section className={styles.text}>
        <header>
          <h2 className="fs-100">{title}</h2>
          <small>({publicationYear})</small>
        </header>
        <p>by {authorName}</p>
        <p>rating: {averageRating}</p>
      </section>
      {children}
    </article>
  );
}

SearchCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  authorName: PropTypes.string.isRequired,
  publicationYear: PropTypes.number,
  averageRating: PropTypes.number,
  children: PropTypes.any,
};
