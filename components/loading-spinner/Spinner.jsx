import React from "react";
import PropTypes from "prop-types";
import styles from "./spinner.module.css";

export default function Spinner({ show, ...props }) {
  return show ? (
    <div {...props} className={`${styles.lds_default} spinner`}>
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
  ) : null;
}

Spinner.propTypes = {
  show: PropTypes.bool.isRequired,
};
