import { useAuthContext } from "../../context/AuthContext";
import styles from "./header.module.css";

export default function Header() {
  const { authState, logout } = useAuthContext();

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
