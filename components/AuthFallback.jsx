import { useRouter } from "next/router";
import Spinner from "./loading-spinner/Spinner";

export default function AuthFallback() {
  const router = useRouter();
  router.push("/");
  return <Spinner show />;
}
