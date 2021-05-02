import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useState } from "react";
import * as yup from "yup";
import { useAuthContext } from "../../context/AuthContext";
import useForm from "../../lib/useForm";
import ErrorMessage from "../error-message/ErrorMessage";
import styles from "./auth-form.module.css";

const authSchema = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(4).required(),
});

export default function AuthForm({ register, closeModal, flipForm }) {
  const { inputs, handleChange } = useForm({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const authContext = useAuthContext();
  const router = useRouter();

  const endpoint = register ? "/api/auth/register" : "/api/auth/login";

  return (
    <>
      <button className="close-modal-btn" onClick={closeModal}>
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
          setErrors(null);
          const { username, password } = inputs;

          try {
            await authSchema.validate(
              { username, password },
              { abortEarly: false },
            );

            setIsLoading(true);

            const { data } = await axios.post(endpoint, { username, password });
            authContext.setAuthState(data.data);

            setIsLoading(false);
            router.push("/search");
          } catch (error) {
            setIsLoading(false);
            console.error(error);

            // network error handling
            if (error.response) {
              if (error.response.status === 401) {
                setErrors({
                  network: ["Invalid credentials. Please try again."],
                });
              } else {
                setErrors({
                  network: ["Something went wrong. Please try again."],
                });
              }
            }

            // Validation error handling
            if (error.inner) {
              setErrors(
                error.inner.reduce((acc, err) => {
                  if (!Array.isArray(acc[err.path])) {
                    acc[err.path] = [];
                  }

                  acc[err.path].push(err.message);

                  return acc;
                }, {}),
              );
            }
          }
        }}
        method="POST"
      >
        <h2>{register ? "Create an account." : "Sign into your account."}</h2>
        {register ? (
          <p>
            Already have an account? Click{" "}
            <button
              onClick={() => {
                flipForm();
              }}
              type="button"
              className="btn-link"
            >
              here
            </button>{" "}
            to login.
          </p>
        ) : (
          <p>
            No account yet? Click{" "}
            <button
              onClick={() => {
                flipForm();
              }}
              type="button"
              className="btn-link"
            >
              here
            </button>{" "}
            to register.
          </p>
        )}
        <fieldset disabled={isLoading} aria-busy={isLoading}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={inputs.username}
            onChange={handleChange}
          />
          <ErrorMessage isVisible={errors?.username?.length > 0}>
            {errors?.username}
          </ErrorMessage>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={inputs.password}
            onChange={handleChange}
          />
          <ErrorMessage
            isVisible={
              errors?.password?.length > 0 || errors?.network?.length > 0
            }
          >
            {errors?.password || errors?.network}
          </ErrorMessage>
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
  closeModal: PropTypes.func.isRequired,
  flipForm: PropTypes.func.isRequired,
};
