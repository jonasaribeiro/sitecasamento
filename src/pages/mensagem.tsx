import styles from "./mensagem.module.css";

export default function MensagemPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>💬 Deixe sua mensagem</h1>
        <p className={styles.subtitle}>
          Escreva algo especial para Jonas & Mariana. Toda palavra será lembrada
          com carinho! 💖
        </p>
      </header>

      <form className={styles.form}>
        <label className={styles.label}>Sua mensagem:</label>
        <textarea
          className={styles.textarea}
          name="mensagem"
          rows={4}
          placeholder="Digite aqui sua mensagem..."
        />

        <label className={styles.label}>Seu nome (opcional):</label>
        <input
          type="text"
          name="nome"
          placeholder="Seu nome"
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Enviar mensagem
        </button>
      </form>
    </main>
  );
}
