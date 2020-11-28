import React from "react";
import styles from "./close-button.module.css";

function CloseButton({ onClick }) {
  return (
    <button onClick={() => onClick()} className={styles.close}>
      <span></span>
      <span></span>
    </button>
  );
}

export default CloseButton;
