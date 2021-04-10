import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={`${styles.sidebar} fs-600`}>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.nav_item}>
            <Link href="/reading-list">ReadingList</Link>
          </li>
          <li className={styles.nav_item}>
            <Link href="/finished">Finished Reading</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
