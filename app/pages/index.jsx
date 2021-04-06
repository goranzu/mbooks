import Link from "next/link";
import styles from "../styles/homepage.module.css";

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.text}>
        <h1>mBooks</h1>
        <p>
          Lorem Ipsum is slechts een proeftekst uit het drukkerij- en
          zetterijwezen. Lorem Ipsum is de standaard proeftekst in deze
          bedrijfstak sinds de 16e eeuw
        </p>
        <p>
          toen een onbekende drukker een zethaak met letters nam en ze door
          elkaar husselde om een font-catalogus te maken.
        </p>
        <div className={styles.buttons}>
          <Link href="/register">
            <a className="btn">Register</a>
          </Link>
          <Link href="/login">
            <a className="btn btn--outline">Login</a>
          </Link>
        </div>
      </section>
      <div className={styles.imageWrapper}>
        {/* <Image
          src="/bag.png"
          alt="bag"
          layout="responsive"
          width={395}
          height={395}
        /> */}
        <img src="/bag.png" alt="bag" />
      </div>
    </main>
  );
}
