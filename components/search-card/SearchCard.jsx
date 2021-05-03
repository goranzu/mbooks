import PropTypes from "prop-types";
import styles from "./search-card.module.css";

export default function SearchCard({
  title,
  imageUrl,
  authorName,
  publishedDate,
  children,
}) {
  return (
    <article className={`${styles.card} center fs-100`}>
      <img src={imageUrl} alt={title} />
      <section className={styles.text}>
        <header>
          <h2 className="fs-100">{title}</h2>

          <small>{publishedDate}</small>
        </header>
        <p>by {authorName}</p>
      </section>
      {children}
    </article>
  );
}

SearchCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  authorName: PropTypes.string.isRequired,
  publishedDate: PropTypes.string,
  children: PropTypes.any,
};
