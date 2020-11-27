import React from "react";
import styles from "./header.module.css";

function Header({ setShowModal }) {
  return (
    <header className={styles.header}>
      <div className="container row">
        <div
          aria-label="toggle navigation menu"
          role="button"
          className={styles.open_nav_button}
          onClick={() => setShowModal(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.logo}>
          <h3>MBooks</h3>
        </div>
        <div className={styles.profile}>
          <p>Liam</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
