import { useState } from "react";
import Modal from "../components/modal/Modal";
import AuthForm from "../components/auth-form/AuthForm";
import styles from "../styles/homepage.module.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [register, setRegister] = useState(false);

  return (
    <>
      {showModal && (
        <Modal>
          <AuthForm
            register={register}
            handleModalClose={() => setShowModal(false)}
          />
        </Modal>
      )}
      <main className={styles.wrapper}>
        <section className={styles.text}>
          <h1>mBooks</h1>
          <p>
            Lorem Ipsum is slechts een proeftekst uit het drukkerij- en
            zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze
            bedrijfstak sinds de 16e eeuw
          </p>
          <p>
            toen een onbekende drukker een zethaak met letters nam en ze door
            elkaar husselde om een font-catalogus te maken.
          </p>
          <div className={styles.buttons}>
            <button
              className="btn"
              onClick={() => {
                setRegister(true);
                setShowModal(true);
              }}
            >
              Register
            </button>
            <button
              onClick={() => {
                setRegister(false);
                setShowModal(true);
              }}
              className="btn btn--outline"
            >
              Login
            </button>
          </div>
        </section>
        <div className={styles.imageWrapper}>
          <img src="/bag.png" alt="bag" />
        </div>
      </main>
    </>
  );
}
