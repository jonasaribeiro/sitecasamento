import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarHomeButton from "../../components/voltarhomebutton";

export default function QuizHomePage() {
  const [rankingNoivo, setRankingNoivo] = useState([]);
  const [rankingNoiva, setRankingNoiva] = useState([]);
  const [rankingCasal, setRankingCasal] = useState([]);
  const [nome, setNome] = useState("");
  const router = useRouter();

  const handleSelecionarQuiz = (tipo: string) => {
    if (!nome.trim()) {
      toast.warn("Digite seu nome antes de começar o quiz!", {
        position: "top-center",
        autoClose: 3000,
      });

      return;
    }
    router.push(`/quiz/${tipo}?nome=${encodeURIComponent(nome)}`);
  };

  useEffect(() => {
    const nomeQuery = router.query.nome;
    if (typeof nomeQuery === "string") {
      setNome(nomeQuery);
    }
  }, [router.query.nome]);

  useEffect(() => {
    const fetchRanking = async (tipo: string, setter: Function) => {
      try {
        const res = await fetch(`/api/quiz/ranking?tipo=${tipo}`);
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error(`Erro ao carregar ranking de ${tipo}:`, err);
      }
    };

    fetchRanking("noivo", setRankingNoivo);
    fetchRanking("noiva", setRankingNoiva);
    fetchRanking("casal", setRankingCasal);
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🎉 Desafie seus conhecimentos</h1>
        <p className={styles.subtitle}>
          Escolha um dos quizzes abaixo e veja se você conhece bem o casal!
        </p>
      </header>

      <div className={styles.form}>
        <label className={styles.label}>
          Seu nome:
          <span className={styles.obrigatorio}>
            (obrigatório - coloque um nome que a gente reconheça 😊)
          </span>
        </label>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite seu nome completo"
          className={styles.input}
        />
      </div>

      <div className={styles.quizButtons}>
        <button
          onClick={() => handleSelecionarQuiz("noivo")}
          className={styles.quizButton}
        >
          Quiz sobre o Noivo 🤵
        </button>
        <button
          onClick={() => handleSelecionarQuiz("noiva")}
          className={styles.quizButton}
        >
          Quiz sobre a Noiva 👰
        </button>
        <button
          onClick={() => handleSelecionarQuiz("casal")}
          className={styles.quizButton}
        >
          Quiz sobre o Casal 💑
        </button>
      </div>

      <section className={styles.rankingSection}>
        <h2 className={styles.rankingTitle}>🏆 Rankings</h2>

        <div className={styles.rankingGroup}>
          <strong>Noivo:</strong>
          {rankingNoivo.length === 0 ? (
            <p>Ninguém ainda!</p>
          ) : (
            rankingNoivo.map((p: any, i: number) => (
              <p key={i}>
                {i + 1}. {p.nome} - {p.acertos}/{p.total}
              </p>
            ))
          )}
        </div>

        <div className={styles.rankingGroup}>
          <strong>Noiva:</strong>
          {rankingNoiva.length === 0 ? (
            <p>Ninguém ainda!</p>
          ) : (
            rankingNoiva.map((p: any, i: number) => (
              <p key={i}>
                {i + 1}. {p.nome} - {p.acertos}/{p.total}
              </p>
            ))
          )}
        </div>

        <div className={styles.rankingGroup}>
          <strong>Casal:</strong>
          {rankingCasal.length === 0 ? (
            <p>Ninguém ainda!</p>
          ) : (
            rankingCasal.map((p: any, i: number) => (
              <p key={i}>
                {i + 1}. {p.nome} - {p.acertos}/{p.total}
              </p>
            ))
          )}
        </div>
      </section>

      <VoltarHomeButton />
      <ToastContainer />
    </main>
  );
}
