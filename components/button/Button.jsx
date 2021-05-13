import React from "react";
import PropTypes from "prop-types";
import styles from "./button.module.css";

export default function Button({ children, variant, ...props }) {
  const className = variant === "outline" ? styles.outline : styles.button;
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
