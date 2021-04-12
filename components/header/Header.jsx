import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./header.module.css";

export default function Header() {
  const authContext = useContext(AuthContext);

  return (
    <header className={styles.header}>
      {authContext.authState?.user && (
        <>
          <p>{authContext.authState.user.username}</p>
          <button className={styles.logout} onClick={authContext.logout}>
            logout
          </button>{" "}
        </>
      )}
    </header>
  );
}
