import { createContext, useContext } from "react";
import { AuthContext } from "./auth";
import axios from "axios";

const FetchContext = createContext();

function FetchProvider({ children }) {
  const authContext = useContext(AuthContext);
  const tokenAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  console.log(authContext.authState.token);

  tokenAxios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authContext.authState.token}`;
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );
  return (
    <FetchContext.Provider value={{ authClient: tokenAxios }}>
      {children}
    </FetchContext.Provider>
  );
}

export { FetchContext, FetchProvider };
