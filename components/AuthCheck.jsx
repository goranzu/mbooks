import PropTypes from "prop-types";
import { useAuthContext } from "../context/AuthContext";
import AuthFallback from "./AuthFallback";

export default function AuthCheck({ children }) {
  const authContext = useAuthContext();

  return authContext.isAuthenticated() ? children : <AuthFallback />;
}

AuthCheck.propTypes = {
  children: PropTypes.any,
};
