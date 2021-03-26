import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <nav>
        <ul>
          <li>
            <Link href="/search">Search</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
