import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { modalContext } from "../modal/Modal";
import styles from "./navigation.module.css";

function Navigation() {
  const { setShowModal } = useContext(modalContext);
  return (
    <div className={styles.nav_container}>
      <div className={`row ${styles.nav_top}`}>
        <h2>MBooks</h2>
        <button
          aria-label="close navigation"
          className={styles.close_nav}
          onClick={() => setShowModal(false)}
        >
          <span></span>
          <span></span>
        </button>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link onClick={() => setShowModal(false)} to="/search">
              Search
            </Link>
          </li>
          <li>
            <Link onClick={() => setShowModal(false)} to="/list">
              Reading List
            </Link>
          </li>
          <li>
            <Link onClick={() => setShowModal(false)} to="/finished">
              Finished Reading
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
