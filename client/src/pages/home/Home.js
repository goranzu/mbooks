import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import AuthForm from "../../components/auth-form/AuthForm,";
import Modal from "../../components/modal/Modal";
import { AuthContext } from "../../context/auth";
import styles from "./home.module.css";

function Home() {
  const [showSignUpModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [errors, setErrors] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { signin, signup } = useContext(AuthContext);

  async function handleSignup(e) {
    const err = await signup(e);
    if (!err) {
      return setRedirect(true);
    }

    setErrors(err);
  }

  async function handleSignin(e) {
    const err = await signin(e);
    if (!err) {
      return setRedirect(true);
    }

    setErrors(err);
  }

  function formatErrors() {
    if (errors.errors?.length > 0) {
      return [...errors.errors].map((err, index) => <p key={index}>{err}</p>);
    }

    return <p>{errors.message}</p>;
  }

  return (
    <>
      {redirect && <Redirect to="/search" />}
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
          <Modal setShowModal={setShowSignupModal}>
            <div className={styles.modal_inner}>
              <AuthForm handleSubmit={handleSignup} title="Signup" />
              {errors && formatErrors()}
            </div>
          </Modal>
        ) : null}
        {showSigninModal ? (
          <Modal setShowModal={setShowSigninModal}>
            <div className={styles.modal_inner}>
              <AuthForm handleSubmit={handleSignin} title="Signin" />
              {errors && formatErrors()}
            </div>
          </Modal>
        ) : null}
      </main>
    </>
  );
}

export default Home;
