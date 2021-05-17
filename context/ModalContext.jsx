import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ModalContext = createContext();

const { Provider } = ModalContext;

function ModalProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <Provider value={{ isModalOpen, closeModal, openModal }}>
      {children}
    </Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.any,
};

function useModal() {
  return useContext(ModalContext);
}

export { ModalProvider, useModal };
