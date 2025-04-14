import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./upload.module.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import VoltarHomeButton from "@/components/voltarhomebutton";

export default function UploadPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [previews, setPreviews] = useState<File[]>([]);
  const [nome, setNome] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPreviews(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previews.length === 0) return;

    const formData = new FormData();
    formData.append("nome", nome);
    previews.forEach((file) => formData.append("arquivos", file));

    try {
      NProgress.start();
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setPreviews([]);
      setNome("");
      setModalAberto(true); // abre o modal
    } catch (error) {
      alert("Erro ao enviar arquivos.");
    } finally {
      NProgress.done();
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📸 Envie suas fotos e vídeos</h1>
        <p className={styles.subtitle}>
          Ajude-nos a registrar cada momento dessa data tão especial! 💖
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Seu nome (opcional):</label>
        <input
          type="text"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite seu nome"
          className={styles.input}
        />

        <label className={styles.label}>Selecione fotos ou vídeos:</label>
        <div {...getRootProps()} className={styles.dropzone}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <p>Clique ou arraste arquivos para enviar</p>
          )}
        </div>

        <div className={styles.previewArea}>
          {previews.map((file, index) => {
            const url = URL.createObjectURL(file);
            return file.type.startsWith("image") ? (
              <img
                key={index}
                src={url}
                alt={`Preview ${index}`}
                className={styles.preview}
              />
            ) : (
              <video
                key={index}
                src={url}
                className={styles.preview}
                controls
              />
            );
          })}
        </div>

        <button type="submit" className={styles.button}>
          Enviar arquivos
        </button>
      </form>
      {modalAberto && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>✨ Obrigado por enviar suas fotos!</h2>
            <p>Você acabou de contribuir para a lembrança eterna desse dia.</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setModalAberto(false)}
                className={styles.modalButton}
              >
                Enviar mais
              </button>
              <a href="/galeria" className={styles.modalLink}>
                Ver mural de fotos
              </a>
            </div>
          </div>
        </div>
      )}
      <VoltarHomeButton />
    </main>
  );
}
