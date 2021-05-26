import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { formatError } from "../../lib/formatError";
import { useAuthReducer } from "../../lib/useAuthReducer";
import useForm from "../../lib/useForm";
import ErrorMessage from "../error-message/ErrorMessage";
import styles from "./auth-form.module.css";

const authSchema = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(4).required(),
});

export default function AuthForm({ register, flipForm }) {
  const { inputs, handleChange, clearForm } = useForm({
    username: "",
    password: "",
  });
  const [state, stateFunctions] = useAuthReducer();
  const authContext = useAuthContext();
  const { closeModal } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const endpoint = register ? "/api/auth/register" : "/api/auth/login";

  async function handleSubmit(e) {
    e.preventDefault();
    const { username, password } = inputs;

    try {
      await authSchema.validate({ username, password }, { abortEarly: false });

      queryClient.setQueryData("searchResults", []);

      stateFunctions.setLoading();

      const { data } = await axios.post(endpoint, { username, password });

      toast.success("Success!");

      authContext.setAuthState(data.data);

      stateFunctions.setResolved();

      closeModal();
      router.push("/search");
    } catch (error) {
      // console.error(error);

      // toast.error(error.message || "Try Again");

      // network error handling
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401 && data?.error?.path === "/api/auth/register") {
          stateFunctions.setErrors({
            username: [data?.error?.message],
          });
        } else {
          stateFunctions.setErrors({
            network: ["Something went wrong. Please try again."],
          });
        }
      }

      // Validation error handling
      if (error.inner) {
        stateFunctions.setErrors(formatError(error.inner));
      }
    }
  }

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
      <form className={styles.form} onSubmit={handleSubmit} method="POST">
        <h2>{register ? "Create an account." : "Sign into your account."}</h2>
        {register ? (
          <p>
            Already have an account? Click{" "}
            <button
              onClick={() => {
                clearForm();
                stateFunctions.setIdle();
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
                clearForm();
                stateFunctions.setIdle();
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
        <fieldset
          disabled={state.status === "loading"}
          aria-busy={state.status === "loading"}
        >
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={inputs.username}
            onChange={handleChange}
          />
          <ErrorMessage show={state.errors?.username?.length > 0}>
            {state.errors?.username}
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
            show={
              state.errors?.password?.length > 0 ||
              state.errors?.network?.length > 0
            }
          >
            {state.errors?.password || state.errors?.network}
          </ErrorMessage>
          <button
            disabled={state.status === "loading"}
            className={register ? "btn" : "btn btn--outline"}
            type="submit"
          >
            {register ? "Register" : "Login"}
          </button>
        </fieldset>
      </form>
    </>
  );
}

AuthForm.propTypes = {
  register: PropTypes.bool.isRequired,
  flipForm: PropTypes.func.isRequired,
};
