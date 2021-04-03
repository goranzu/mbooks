import axios from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import Page from "../components/Page";
import queryClient from "../lib/queryClient";
import useForm from "../lib/useForm";

export default function RegisterPage() {
  const { inputs, handleChange } = useForm({
    username: "liam",
    password: "liam",
  });

  const { mutate, status, error } = useMutation(
    (inputs) => axios.post("/api/register", inputs),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("user", data.data.data);
        router.push("/search");
      },
    },
  );

  const router = useRouter();

  return (
    <Page>
      {status === "error" && <p>{error.message}</p>}
      <h1>Register</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { username, password } = inputs;
          if (username.length === 0 || password.length === 0) return;

          mutate(inputs);
        }}
        method="POST"
      >
        <fieldset>
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
        <button type="submit">Register</button>
      </form>
    </Page>
  );
}
