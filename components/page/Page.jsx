import PropTypes from "prop-types";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import styles from "./page.module.css";

function Page({ children }) {
  return (
    <div>
      <div>
        <div className={styles.container}>
          <Header />
        </div>
      </div>
      <main className={styles.wrapper}>
        <Sidebar />
        {children}
      </main>
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Page;
