import { useState } from "react";
import Modal from "../components/modal/Modal";
import AuthForm from "../components/auth-form/AuthForm";
import styles from "../styles/homepage.module.css";
import { useModal } from "../context/ModalContext";

export default function Home() {
  const { isModalOpen, openModal } = useModal();
  const [register, setRegister] = useState(false);

  // Handle loading states
  // disable note button while sending note

  return (
    <>
      {isModalOpen && (
        <Modal>
          <AuthForm
            register={register}
            flipForm={() => setRegister(!register)}
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
                openModal();
              }}
            >
              Register
            </button>
            <button
              onClick={() => {
                setRegister(false);
                openModal();
              }}
              className="btn btn--outline"
            >
              Login
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
