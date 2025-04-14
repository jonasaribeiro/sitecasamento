import { useEffect, useState } from "react";
import styles from "./galeria.module.css";
import VoltarHomeButton from "../components/voltarhomebutton";

type GaleriaResponse = {
  imagens: string[];
  temMais: boolean;
};

export default function GaleriaPage() {
  const [fotos, setFotos] = useState<string[]>([]);
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(
    null
  );

  const carregarMais = async () => {
    if (carregando || !temMais) return;

    setCarregando(true);
    try {
      const res = await fetch(`/api/galeria?page=${pagina}&limit=15`);
      const data: GaleriaResponse = await res.json();

      setFotos((prev) => [...prev, ...data.imagens]);
      setTemMais(data.temMais);
      setPagina((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMais(); // carrega a primeira página
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 Mural de fotos da recepção</h1>
        <p className={styles.subtitle}>
          Veja os registros enviados por nossos convidados!
        </p>
      </header>

      <div className={styles.grid}>
        {fotos.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Foto ${index}`}
            className={styles.img}
            onClick={() => setImagemSelecionada(src)}
          />
        ))}
      </div>

      <div className={styles.actions}>
        <button
          onClick={carregarMais}
          disabled={!temMais || carregando}
          className={styles.button}
        >
          {temMais
            ? carregando
              ? "Carregando..."
              : "Carregar mais"
            : "Não há mais fotos"}
        </button>
      </div>

      {imagemSelecionada && (
        <div
          className={styles.modal}
          onClick={() => setImagemSelecionada(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imagemSelecionada} className={styles.modalImage} />
            <button
              className={styles.fechar}
              onClick={() => setImagemSelecionada(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <VoltarHomeButton />
    </main>
  );
}
