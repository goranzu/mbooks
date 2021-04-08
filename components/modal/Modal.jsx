import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { createRef, useEffect } from "react";

export default function Modal({ children }) {
  // Make sure execution is on the browser
  let modalRef;
  let modalRoot;
  if (typeof window !== "undefined") {
    modalRoot = document.getElementById("modal-root");
    modalRef = createRef(null);
  }

  if (modalRef.current == null) {
    modalRef.current = document.createElement("div");
    modalRef.current.classList.add("modal-outer");
  }

  useEffect(() => {
    modalRoot.appendChild(modalRef.current);

    return () => modalRoot.removeChild(modalRef.current);
  }, [modalRef]);

  if (typeof window !== undefined) {
    return createPortal(
      <div className="modal-inner">{children}</div>,
      modalRef.current,
    );
  } else {
    return null;
  }
}

Modal.propTypes = {
  children: PropTypes.any,
};
