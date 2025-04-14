import { useState, useEffect } from "react";
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
    texto: "Onde Jonas e Mariana se conheceram?",
    alternativas: ["Faculdade", "Trabalho", "Internet", "Na padaria"],
    correta: "Faculdade",
  },
  {
    texto: "Qual o prato preferido dos dois?",
    alternativas: ["Pizza", "Churrasco", "Sushi", "Batata frita"],
    correta: "Batata frita",
  },
  {
    texto: "Qual o destino da lua de mel?",
    alternativas: ["Paris", "Gramado", "Fernando de Noronha", "Orlando"],
    correta: "Gramado",
  },
];

export default function QuizCasal() {
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
      tipo: "casal",
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
        <h1 className={styles.title}>💑 Quiz sobre o Casal</h1>
        <p className={styles.subtitle}>
          Vamos ver o quanto você conhece Jonas & Mariana!
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
              ? "Incrível! Você merece um presente dos noivos 😄"
              : acertos >= 2
                ? "Mandou bem! Você conhece bastante o casal!"
                : "Ops... Ainda dá tempo de aprender mais sobre eles!"}
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
