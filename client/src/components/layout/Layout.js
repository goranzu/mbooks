import React, { useState } from "react";
import Header from "../header/Header";
import Modal from "../modal/Modal";
import Navigation from "../navigation/Navigation";

function Layout({ children }) {
  const [showNavigation, setShowNavigation] = useState(false);

  return (
    <>
      <Header setShowNavigation={setShowNavigation} />
      {showNavigation ? (
        <Modal>
          <Navigation setShowNavigation={setShowNavigation} />
        </Modal>
      ) : null}
      <main>{children}</main>
    </>
  );
}

export default Layout;
