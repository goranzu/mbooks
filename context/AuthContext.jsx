import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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

  const fetchUserData = useCallback(async function fetchUserData() {
    try {
      const { data } = await privateFetch().get("/user");
      setAuthState({ user: data.data.user, expiresAt: data.data.expiresAt });
    } catch (error) {
      setAuthState({ user: null });
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [queryClient, fetchUserData]);

  function setAuthInfo({ user, expiresAt }) {
    setAuthState({ user, expiresAt });
    queryClient.setQueryData(USER_BOOKS_QUERY_KEY, user.books);
  }

  async function logout() {
    try {
      await publicFetch.delete("/auth/logout");
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

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within the AuthProvider.");
  }
  return context;
}

export { useAuthContext, AuthProvider };
