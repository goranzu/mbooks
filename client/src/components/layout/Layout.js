import React, { useState } from "react";
import Header from "../header/Header";
import Modal from "../modal/Modal";
import Navigation from "../navigation/Navigation";

function Layout({ children }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header setShowModal={setShowModal} />
      {showModal ? (
        <Modal setShowModal={setShowModal}>
          <Navigation />
        </Modal>
      ) : null}
      <main>{children}</main>
    </>
  );
}

export default Layout;
