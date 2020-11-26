import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ children }) {
  // TODO: trap focus
  const elRef = useRef(null);
  if (!elRef.current) {
    const div = document.createElement("div");
    div.className = "modal-outer";
    elRef.current = div;
  }

  useEffect(() => {
    const modalRoot = document.querySelector("#modal");
    modalRoot.appendChild(elRef.current);

    return () => {
      modalRoot.removeChild(elRef.current);
    };
  }, []);

  return createPortal(children, elRef.current);
}

export default Modal;
