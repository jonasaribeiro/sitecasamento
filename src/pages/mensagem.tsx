import { useState } from "react";
import styles from "./mensagem.module.css";
import VoltarHomeButton from "../components/voltarhomebutton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MensagemPage() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensagem.trim()) {
      toast.warn("Por favor, escreva uma mensagem 💬");
      return;
    }

    try {
      setEnviando(true);

      await fetch("/api/mensagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          mensagem,
        }),
      });

      toast.success("Mensagem enviada com sucesso! 🎉");

      setMensagem("");
      setNome("");
    } catch (err) {
      toast.error("Erro ao enviar mensagem 😢");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>💬 Deixe sua mensagem</h1>
        <p className={styles.subtitle}>
          Escreva algo especial para Jonas & Mariana. Toda palavra será guardada
          com carinho! 💖
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Sua mensagem:</label>
        <textarea
          className={styles.textarea}
          name="mensagem"
          rows={4}
          placeholder="Digite aqui sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />

        <label className={styles.label}>Seu nome (opcional):</label>
        <input
          type="text"
          name="nome"
          placeholder="Seu nome"
          className={styles.input}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <button type="submit" className={styles.button} disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>

      <VoltarHomeButton />
      <ToastContainer />
    </main>
  );
}
