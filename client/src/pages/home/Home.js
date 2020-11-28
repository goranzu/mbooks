import React, { useState, useContext } from "react";
import CloseButton from "../../components/close-btn/CloseButton";
import Modal from "../../components/modal/Modal";
import { AuthContext } from "../../context/auth";
import styles from "./home.module.css";
import FocusLock from "react-focus-lock";

function Home() {
  const [showSignUpModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const { signin, signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>MBooks</div>
        <button
          onClick={() => setShowSigninModal(true)}
          className={styles.signin}
        >
          Signin
        </button>
        <button
          onClick={() => setShowSignupModal(true)}
          className={styles.signup}
        >
          Signup
        </button>
      </div>
      {showSignUpModal ? (
        <FocusLock group="modal">
          <Modal setShowModal={setShowSignupModal}>
            <div className={styles.modal_inner}>
              <CloseButton onClick={() => setShowSignupModal(false)} />
              <h3>Signup</h3>
              <form
                onSubmit={(e) => {
                  signup(e);
                }}
                className={styles.form}
              >
                <label htmlFor="username">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  required
                />
                <button type="submit">Signup</button>
              </form>
            </div>
          </Modal>
        </FocusLock>
      ) : null}
      {showSigninModal ? (
        <FocusLock group="modal">
          <Modal setShowModal={setShowSigninModal}>
            <div className={styles.modal_inner}>
              <CloseButton onClick={() => setShowSigninModal(false)} />
              <h3>Signin</h3>
              <form
                onSubmit={(e) => {
                  signin(e);
                }}
                className={styles.form}
              >
                <label htmlFor="username">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  name="username"
                  id="username"
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  required
                />
                <button type="submit">Signin</button>
              </form>
            </div>
          </Modal>
        </FocusLock>
      ) : null}
    </main>
  );
}

export default Home;
