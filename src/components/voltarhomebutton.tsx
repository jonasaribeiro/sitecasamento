import Link from "next/link";
import styles from "./voltarhomebutton.module.css";

export default function VoltarHomeButton() {
  return (
    <Link
      href="/"
      className={styles.button}
      aria-label="Voltar para a página inicial"
    >
      🏠
    </Link>
  );
}
