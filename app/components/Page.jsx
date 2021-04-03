import PropTypes from "prop-types";
import Header from "./header/Header";

function Page({ children }) {
  return (
    <>
      <Header />
      <main className="wrapper">{children}</main>
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
