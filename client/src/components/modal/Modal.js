import { createContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";

export const modalContext = createContext();

function Modal({ children, setShowModal }) {
  const elRef = useRef(null);
  if (!elRef.current) {
    const div = document.createElement("div");
    div.classList.add("modal-outer");
    div.setAttribute("aria-modal", "true");
    div.setAttribute("role", "dialog");
    elRef.current = div;
  }

  useEffect(() => {
    const modalRoot = document.querySelector("#modal");
    modalRoot.appendChild(elRef.current);

    return () => modalRoot.removeChild(elRef.current);
  }, []);

  const keyListenersMap = new Map([["Escape", () => setShowModal(false)]]);

  useEffect(() => {
    function keyListener(e) {
      const listener = keyListenersMap.get(e.key);
      return listener && listener(e);
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  });

  return createPortal(
    <modalContext.Provider value={{ setShowModal }}>
      <FocusLock group="modal">{children}</FocusLock>
    </modalContext.Provider>,
    elRef.current,
  );
}

export default Modal;
