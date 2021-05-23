import React from "react";
import PropTypes from "prop-types";
import styles from "./button.module.css";

export default function Button({ children, variant, ...props }) {
  let className = null;

  switch (variant) {
    case "outline":
      className = styles.outline;
      break;
    case "delete":
      className = styles.del;
      break;
    default:
      className = styles.button;
      break;
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  variant: PropTypes.string,
};
