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
    path: "/books",
    query: "reading",
  },
  {
    label: "Finished Reading",
    path: "/books",
    query: "finished",
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
              router.asPath ===
              (router.query.list
                ? `${item.path}?list=${item.query}`
                : `${item.path}`)
                ? `${styles.nav_item} ${styles.active}`
                : `${styles.nav_item}`;

            return (
              <li key={item.label} className={className}>
                <Link
                  href={{
                    pathname: item.path,
                    query: item.query ? { list: item.query } : null,
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
