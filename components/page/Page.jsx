import PropTypes from "prop-types";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import styles from "./page.module.css";

function Page({ children }) {
  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <Sidebar />
        <section>{children}</section>
      </main>
    </>
  );
}

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Page;
