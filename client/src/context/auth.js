import { createContext } from "react";

export const AuthContext = createContext();

function client(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      console.log(res.status);
      throw new Error(res.status);
    }
  });
}

function AuthProvider({ children }) {
  const url = process.env.REACT_APP_API_URL;
  const AUTH_CONSTANT = "auth";

  function saveAuthDataInLocalstrorage(data) {
    localStorage.setItem(AUTH_CONSTANT, JSON.stringify(data));
  }

  function getAuthDataFromLocalstorage() {
    return JSON.parse(localStorage.getItem(AUTH_CONSTANT) || {});
  }

  function isAuth() {
    const data = getAuthDataFromLocalstorage();
    // Unix Timestamp
    if (data.expiresAt > Date.now() / 1000) {
      return true;
    } else {
      return false;
    }
  }

  async function signin(e) {
    e.preventDefault();
    const signinUrl = url + "/auth/signin";
    const payload = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    let response;
    try {
      response = await client(signinUrl, payload);
      saveAuthDataInLocalstrorage(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function signup(e) {
    e.preventDefault();
    const signupUrl = url + "/auth/signup";
    const payload = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    let response;
    try {
      response = await client(signupUrl, payload);
      saveAuthDataInLocalstrorage(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signin, signup, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
