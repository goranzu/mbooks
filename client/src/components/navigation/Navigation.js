import React from "react";
import { Link } from "react-router-dom";
import styles from "./navigation.module.css";

function Navigation({ setShowNavigation }) {
  return (
    <div className={styles.nav_container}>
      <div className={`row ${styles.nav_top}`}>
        <h2>MBooks</h2>
        <div
          aria-label="close navigation"
          className={styles.close_nav}
          onClick={() => setShowNavigation(false)}
        >
          <span></span>
          <span></span>
        </div>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li onClick={() => setShowNavigation(false)}>
            <Link to="/search">Search</Link>
          </li>
          <li onClick={() => setShowNavigation(false)}>
            <Link to="/list">Reading List</Link>
          </li>
          <li onClick={() => setShowNavigation(false)}>
            <Link to="/finished">Finished Reading</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
