import Link from "next/link";
import styles from "./index.module.css";

export default function Home() {
  const cards = [
    {
      title: "Enviar fotos e vídeos",
      description: "Contribua com lembranças incríveis desse dia.",
      href: "/upload",
      emoji: "📸",
    },
    {
      title: "Deixar uma mensagem",
      description: "Escreva algo especial para os noivos!",
      href: "/mensagem",
      emoji: "💬",
    },
    {
      title: "Mural de fotos da recepção",
      description: "Veja os registros de todos os ângulos.",
      href: "/galeria",
      emoji: "🧱",
    },
    {
      title: "Quiz dos Noivos",
      description: "Quanto você conhece Jonas e Mariana?",
      href: "/quiz",
      emoji: "❓",
    },
  ];

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mariana & Jonas</h1>
        <p className={styles.subtitle}>26 de Abril de 2025</p>
      </header>

      <section className={styles.section}>
        {cards.map((item) => (
          <div key={item.title} className={styles.card}>
            <div className={styles.cardTop}>
              <span style={{ fontSize: "1.5rem" }}>{item.emoji}</span>
              <div>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>
            </div>
            <div className={styles.buttonWrap}>
              <Link href={item.href}>
                <button className={styles.button}>Acessar</button>
              </Link>
            </div>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>Obrigado por fazer parte do nosso dia especial 💖</p>
      </footer>
    </main>
  );
}
