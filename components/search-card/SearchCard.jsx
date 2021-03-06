import Link from "next/link";
import PropTypes from "prop-types";
import styles from "./search-card.module.css";

export default function SearchCard({
  title,
  imageUrl,
  authorName,
  publishedDate,
  children,
  googleId,
}) {
  return (
    <article className={`${styles.card} center fs-100`}>
      <img src={imageUrl} alt={title} />
      <section className={styles.text}>
        <header>
          <Link href={`/books/${googleId}`}>
            <a>
              <h2 className="fs-100">{title}</h2>
            </a>
          </Link>
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
  googleId: PropTypes.string,
  children: PropTypes.any,
};
