import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./header.module.css";

export default function Header() {
  const { authState, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      {authState?.user && (
        <>
          <p>{authState.user.username}</p>
          <button className={styles.logout} onClick={logout}>
            logout
          </button>{" "}
        </>
      )}
    </header>
  );
}
