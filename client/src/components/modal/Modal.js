import { createContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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

  const keyListenersMap = new Map([
    ["Escape", () => setShowModal(false)],
    ["Tab", handleTabKey],
  ]);

  useEffect(() => {
    function keyListener(e) {
      const listener = keyListenersMap.get(e.key);
      return listener && listener(e);
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  });

  // HandleTabKey closes over focusElementIndex

  let focusElementIndex = 0;

  function handleTabKey(e) {
    const focusAbleElements = elRef.current.querySelectorAll(
      `a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox], select`,
    );

    if (!e.shiftKey) {
      focusElementIndex = (focusElementIndex + 1) % focusAbleElements.length;
      focusAbleElements[focusElementIndex].focus();
      e.preventDefault();
    }

    if (e.shiftKey) {
      focusElementIndex =
        (focusElementIndex - 1 + focusAbleElements.length) %
        focusAbleElements.length;
      focusAbleElements[focusElementIndex].focus();
      e.preventDefault();
    }
  }

  return createPortal(
    <modalContext.Provider value={{ setShowModal }}>
      {children}
    </modalContext.Provider>,
    elRef.current,
  );
}

export default Modal;
