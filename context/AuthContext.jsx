import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { privateFetch, publicFetch } from "../lib/fetch";
import { useQueryClient } from "react-query";
import { USER_BOOKS_QUERY_KEY } from "../lib/constants";

const AuthContext = createContext();
const { Provider } = AuthContext;

function AuthProvider({ children }) {
  const router = useRouter();
  const [authState, setAuthState] = useState();
  const queryClient = useQueryClient();

  useEffect(() => {
    (async function () {
      try {
        const { data } = await privateFetch().get("/user");
        setAuthState({ user: data.data.user, expiresAt: data.data.expiresAt });
        queryClient.setQueryData(USER_BOOKS_QUERY_KEY, data.data.user.books);
      } catch (error) {
        setAuthState({ user: null });
        console.error(error);
      }
    })();
  }, [queryClient]);

  function setAuthInfo({ user, expiresAt }) {
    setAuthState({ user, expiresAt });
    queryClient.setQueryData(USER_BOOKS_QUERY_KEY, user.books);
  }

  async function logout() {
    try {
      await publicFetch.delete("/logout");
      setAuthState({ user: null, expiresAt: null });
      queryClient.setQueryData(USER_BOOKS_QUERY_KEY, null);
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
