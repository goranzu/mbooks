import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./sidebar.module.css";

const navItems = [
  {
    label: "Search",
    path: "/search",
  },
  {
    label: "Reading List",
    path: "/reading-list",
  },
  {
    label: "Finished Reading",
    path: "/finished",
  },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside className={`${styles.sidebar} fs-600`}>
      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => {
            const className =
              router.pathname === item.path
                ? `${styles.nav_item} ${styles.active}`
                : `${styles.nav_item}`;

            return (
              <li key={item.label} className={className}>
                <Link href={item.path}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
