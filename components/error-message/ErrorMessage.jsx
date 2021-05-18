import React from "react";
import PropTypes from "prop-types";
import styles from "./error-message.module.css";

export default function ErrorMessage({ children, show }) {
  let message = children ? children[0] : "";
  return (
    <p className={`${styles.message} fs-100`} aria-disabled={!show}>
      {children
        ? message.charAt(0).toUpperCase() + message.slice(1)
        : "place holder to prevent shifting"}
    </p>
  );
}

ErrorMessage.propTypes = {
  children: PropTypes.array,
  show: PropTypes.bool.isRequired,
};
