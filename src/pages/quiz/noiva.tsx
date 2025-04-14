import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import VoltarHomeButton from "../../components/voltarhomebutton";

type Pergunta = {
  texto: string;
  alternativas: string[];
  correta: string;
};

const perguntas: Pergunta[] = [
  {
    texto: "Qual o doce preferido da Mariana?",
    alternativas: ["Brigadeiro", "Torta de Limão", "Pudim", "Sorvete"],
    correta: "Torta de Limão",
  },
  {
    texto: "Qual a cor favorita da Mariana?",
    alternativas: ["Rosa", "Verde", "Terracota", "Azul"],
    correta: "Terracota",
  },
  {
    texto: "Em qual mês a Mariana faz aniversário?",
    alternativas: ["Janeiro", "Março", "Julho", "Outubro"],
    correta: "Julho",
  },
];

export default function QuizNoiva() {
  const router = useRouter();
  const { nome } = router.query;

  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  let acertosTemp = acertos;

  const [finalizado, setFinalizado] = useState(false);

  const perguntaAtual = perguntas[indice];

  const handleResposta = (resposta: string) => {
    if (resposta === perguntaAtual.correta) {
      acertosTemp += 1;
    }

    if (indice + 1 < perguntas.length) {
      setIndice((prev) => prev + 1);
      setAcertos(acertosTemp);
    } else {
      setAcertos(acertosTemp);
      setFinalizado(true);
      salvarResultado(acertosTemp); // passa o valor correto!
    }
  };

  const salvarResultado = async (pontuacaoFinal: number) => {
    if (!nome || typeof nome !== "string") return;

    const resultado = {
      nome,
      acertos: pontuacaoFinal,
      total: perguntas.length,
      tipo: "noiva",
    };

    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultado),
      });
    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>👰 Quiz sobre a Noiva</h1>
        <p className={styles.subtitle}>
          Vamos ver quem realmente conhece a Mariana!
        </p>
      </header>

      {!finalizado ? (
        <div className={styles.quizCard}>
          <p className={styles.question}>
            {indice + 1}. {perguntaAtual.texto}
          </p>
          <div className={styles.options}>
            {perguntaAtual.alternativas.map((opcao, i) => (
              <button
                key={i}
                className={styles.optionButton}
                onClick={() => handleResposta(opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.quizCard}>
          <h2>🎉 {nome}, você finalizou o quiz!</h2>
          <p>
            Você acertou <strong>{acertos}</strong> de {perguntas.length}{" "}
            perguntas!
          </p>
          <p style={{ marginTop: "8px" }}>
            {acertos === perguntas.length
              ? "Mariana vai ficar impressionada! 👑"
              : acertos >= 2
                ? "Nada mal! Você conhece bem a noiva!"
                : "Hmmm... talvez precise conversar mais com ela 😂"}
          </p>

          <button
            className={styles.quizButtonFinal}
            onClick={() =>
              router.push(`/quiz?nome=${encodeURIComponent(nome as string)}`)
            }
          >
            Escolher outro quiz
          </button>
        </div>
      )}

      <VoltarHomeButton />
    </main>
  );
}
