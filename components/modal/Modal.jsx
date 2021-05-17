import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import FocusLock from "react-focus-lock";
import { useModal } from "../../context/ModalContext";

export default function Modal({ children }) {
  const { closeModal } = useModal();

  useEffect(() => {
    function keyListener(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    function onOuterModalClick(e) {
      if (e.target.classList.contains("modal-outer")) {
        closeModal();
      }
    }

    document.addEventListener("keydown", keyListener);
    document.addEventListener("click", onOuterModalClick);

    return () => {
      document.removeEventListener("keydown", keyListener);
      document.removeEventListener("click", onOuterModalClick);
    };
  }, [closeModal]);

  return createPortal(
    <FocusLock>
      <div className="modal-outer" role="dialog" aria-modal="true">
        <div className="modal-inner">{children}</div>
      </div>
    </FocusLock>,
    document.body,
  );
}

Modal.propTypes = {
  children: PropTypes.any,
};
