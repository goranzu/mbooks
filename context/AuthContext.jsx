import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { privateFetch, publicFetch } from "../lib/fetch";

const AuthContext = createContext();
const { Provider } = AuthContext;

function AuthProvider({ children }) {
  const router = useRouter();
  const [authState, setAuthState] = useState();

  useEffect(() => {
    (async function () {
      try {
        const { data } = await privateFetch().get("/user");
        setAuthState({ user: data.data.user, expiresAt: data.data.expiresAt });
      } catch (error) {
        setAuthState({ user: null });
        console.error(error);
      }
    })();
  }, []);

  function setAuthInfo({ user, expiresAt }) {
    setAuthState({ user, expiresAt });
  }

  async function logout() {
    try {
      await publicFetch.delete("/logout");
      setAuthState({ user: null, expiresAt: null });
      router.push("/");
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  function isAuthenticated() {
    if (!authState.expiresAt) {
      return false;
    }
    return new Date().getTime() / 1000 < authState.expiresAt;
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.any,
};

export { AuthContext, AuthProvider };
