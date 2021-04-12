import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const FetchContext = createContext();
const { Provider } = FetchContext;

function FetchProvider({ children }) {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({ baseURL: "/api" });

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authContext.authState.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const code = error?.response?.status || 0;
      if (code === 401 || code === 403) {
        console.error("error code", code);
      }
      return Promise.reject(error);
    },
  );

  return <Provider value={{ authAxios }}>{children}</Provider>;
}

FetchProvider.propTypes = {
  children: PropTypes.any,
};

export { FetchContext, FetchProvider };
