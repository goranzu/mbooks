import axios from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import useForm from "../lib/useForm";
import queryClient from "../lib/queryClient";

export default function LoginPage() {
  const { inputs, handleChange } = useForm({
    username: "liam",
    password: "liam",
  });

  const { mutate, error, status } = useMutation(
    (inputs) => axios.post("/api/login", inputs),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("user", data.data.data);
        router.push("/search");
      },
    },
  );

  const router = useRouter();

  return (
    <main>
      {status === "error" && <p>{error.message}</p>}
      <h1>Login</h1>
      <form
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();

          const { username, password } = inputs;

          if (username.length === 0 || password.length === 0) return;

          mutate(inputs);
        }}
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
          <button type="submit">Login</button>
        </fieldset>
      </form>
    </main>
  );
}
