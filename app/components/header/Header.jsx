import axios from "axios";
import { useMutation } from "react-query";
import queryClient from "../../lib/queryClient";
import { useRouter } from "next/router";
import styles from "./header.module.css";

export default function Header() {
  const user = queryClient.getQueryData("user");
  const router = useRouter();

  const { mutate } = useMutation(() => axios.get("/api/logout"), {
    onSuccess: (data) => {
      queryClient.setQueryData("user", data.data.data);
      router.push("/login");
    },
  });

  async function handleLogout() {
    mutate();
  }

  return (
    <header className={styles.header}>
      {user?.user && (
        <>
          <p>{user.user.username}</p>
          <button onClick={handleLogout}>logout</button>{" "}
        </>
      )}
    </header>
  );
}
