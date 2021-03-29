import PropTypes from "prop-types";

function Page({ children }) {
  return <main className="wrapper">{children}</main>;
}

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Page;
