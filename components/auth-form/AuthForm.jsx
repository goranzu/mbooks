import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import useForm from "../../lib/useForm";
import styles from "./auth-form.module.css";

export default function AuthForm({ register, handleModalClose }) {
  // TODO: Handle Errors
  const { inputs, handleChange } = useForm({
    username: "liam",
    password: "liam",
  });
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const endpoint = register ? "/api/auth/register" : "/api/auth/login";

  return (
    <>
      <button className="close-modal-btn" onClick={handleModalClose}>
        <span className="sr-only">Close Modal</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          const { username, password } = inputs;
          if (username.length === 0 || password.length === 0) return;

          try {
            setIsLoading(true);
            const { data } = await axios.post(endpoint, { username, password });
            console.log(data);
            authContext.setAuthState(data.data);
            handleModalClose();
            setIsLoading(false);
            router.push("/search");
          } catch (error) {
            setIsLoading(false);
            console.error(error);
          }
        }}
        method="POST"
      >
        <h2>{register ? "Create an account." : "Signin into your account."}</h2>
        {register ? (
          <p>
            Already have an account? Click{" "}
            <button type="button" className="btn-link">
              here
            </button>{" "}
            to login.
          </p>
        ) : (
          <p>
            No account yet? Click{" "}
            <button type="button" className="btn-link">
              here
            </button>{" "}
            to register.
          </p>
        )}
        {/* {status === "error" && <p>{error.message}</p>} */}
        <fieldset disabled={status === "loading"}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={inputs.username}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </fieldset>
        <button
          disabled={isLoading}
          className={register ? "btn" : "btn btn--outline"}
          type="submit"
        >
          {register ? "Register" : "Login"}
        </button>
      </form>
    </>
  );
}

AuthForm.propTypes = {
  register: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
};
