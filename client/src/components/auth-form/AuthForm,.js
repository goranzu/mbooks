import React, { useContext, useState } from "react";
import CloseButton from "../close-btn/CloseButton";
import { modalContext } from "../modal/Modal";
import styles from "./auth_form.module.css";

function AuthForm({ handleSubmit, title }) {
  const { setShowModal } = useContext(modalContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <CloseButton onClick={() => setShowModal(false)} />
      <h3>{title}</h3>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
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
    </>
  );
}

export default AuthForm;
