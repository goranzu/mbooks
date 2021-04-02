import Link from "next/link";
import Page from "../components/Page";

export default function Home() {
  return (
    <Page>
      <h1>Hello World</h1>
      <nav>
        <ul>
          <li>
            <Link href="/search">Search</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </Page>
  );
}
