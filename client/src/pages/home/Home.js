import React, { useState, useContext } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import AuthForm from "../../components/auth-form/AuthForm,";
import Modal from "../../components/modal/Modal";
import { AuthContext } from "../../context/auth";
import styles from "./home.module.css";

function publicApiClient(url, credentials) {
  return axios.post(url, credentials);
}

function Home() {
  const [signinUsername, setSigninUsername] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [showSignUpModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const authContext = useContext(AuthContext);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
      } = await publicApiClient(
        `${process.env.REACT_APP_API_URL}/auth/signup`,
        { username: signupUsername, password: signupPassword },
      );
      authContext.setAuthState(data.data);
      setErrors([]);
      setRedirect(true);
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data.message);
    }
  }

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
      } = await publicApiClient(
        `${process.env.REACT_APP_API_URL}/auth/signin`,
        { username: signinUsername, password: signinPassword },
      );
      authContext.setAuthState(data.data);
      setErrors([]);
      setRedirect(true);
    } catch (error) {
      setLoading(false);
      setErrors(error.response.data.message);
    }
  }

  function formatErrors() {
    if (errors.length > 0) {
      return errors.map((err, index) => <p key={index}>{err}</p>);
    }
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
              <AuthForm
                setUsername={setSignupUsername}
                username={signupUsername}
                password={signupPassword}
                setPassword={setSignupPassword}
                handleSubmit={handleSignup}
                title="Signup"
                disabled={loading}
              />
              {errors && formatErrors()}
            </div>
          </Modal>
        ) : null}
        {showSigninModal ? (
          <Modal setShowModal={setShowSigninModal}>
            <div className={styles.modal_inner}>
              <AuthForm
                username={signinUsername}
                setUsername={setSigninUsername}
                password={signinPassword}
                setPassword={setSigninPassword}
                handleSubmit={handleSignin}
                title="Signin"
                disabled={loading}
              />
              {errors && formatErrors()}
            </div>
          </Modal>
        ) : null}
      </main>
    </>
  );
}

export default Home;
