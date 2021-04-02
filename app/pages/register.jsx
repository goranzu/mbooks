import axios from "axios";
import { useRouter } from "next/router";
import Page from "../components/Page";
import useForm from "../lib/useForm";

export default function RegisterPage() {
  const { inputs, handleChange } = useForm({
    username: "liam",
    password: "liam",
  });

  const router = useRouter();

  return (
    <Page>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { username, password } = inputs;
          if (username.length === 0 || password.length === 0) return;

          try {
            await axios.post("/api/register", inputs);
            // Redirect to search page after successfull register
            router.push("/search");
          } catch (error) {
            console.error(error);
          }
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
