import React from "react";
import styles from "./spinner.module.css";

export default function Spinner() {
  return (
    <div className={`${styles.lds_default} spinner`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
