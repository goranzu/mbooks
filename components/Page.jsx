import PropTypes from "prop-types";
import Header from "./header/Header";
import Link from "next/link";

function Page({ children }) {
  return (
    <>
      <Header />
      <main className="wrapper">
        <aside>
          <nav>
            <ul>
              <li>
                <Link href="/search">Search</Link>
              </li>
              <li>
                <Link href="/reading-list">ReadingList</Link>
              </li>
            </ul>
          </nav>
        </aside>
        {children}
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
