import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const TOKEN = "token";
  const EXPIREST_AT = "expiresAt";
  const USER = "user";

  const token = localStorage.getItem(TOKEN);
  const expiresAt = localStorage.getItem(EXPIREST_AT);
  const user = localStorage.getItem(USER);

  const [authState, setAuthState] = useState({
    user: user ? JSON.parse(user) : {},
    token: token,
    expiresAt: expiresAt,
  });

  function setAuthInfo({ token, user, expiresAt }) {
    setAuthState({ token, user, expiresAt });
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(EXPIREST_AT, expiresAt);
    localStorage.setItem(USER, JSON.stringify(user));
  }

  function isAuth() {
    if (!authState.token || !authState.expiresAt) {
      return false;
    }

    return authState.expiresAt > new Date().getTime() / 1000;
  }

  function logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(EXPIREST_AT);
    setAuthState({
      token: null,
      expiresAt: null,
      user: {},
    });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        authState,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
