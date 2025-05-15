import Masonry from "react-masonry-css";
import { useEffect, useState } from "react";
import styles from "./galeria.module.css";
import VoltarHomeButton from "../components/voltarhomebutton";
import { motion, AnimatePresence } from "framer-motion";

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
      const res = await fetch(`/api/galeria?page=${pagina}&limit=6`);
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
    carregarMais();
  }, []);

  const breakpoints = {
    default: 3,
    310: 2,
    180: 1,
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 Mural de fotos da recepção</h1>
        <p className={styles.subtitle}>
          Veja os registros enviados por nossos convidados!
        </p>
      </header>

      <Masonry
        breakpointCols={breakpoints}
        className={styles.masonryGrid}
        columnClassName={styles.masonryColumn}
      >
        {fotos.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Foto ${index}`}
            className={styles.img}
            loading="lazy"
            onClick={() => setImagemSelecionada(src)}
          />
        ))}
      </Masonry>

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

      <AnimatePresence>
        {imagemSelecionada && (
          <motion.div
            className={styles.modal}
            onClick={() => setImagemSelecionada(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.img
                src={imagemSelecionada}
                className={styles.modalImage}
                layoutId="zoom-image"
              />
              <button
                className={styles.fechar}
                onClick={() => setImagemSelecionada(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VoltarHomeButton />
    </main>
  );
}
