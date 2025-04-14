import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./upload.module.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import VoltarHomeButton from "../components/voltarhomebutton";
import { toast, ToastContainer } from "react-toastify";

export default function UploadPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [previews, setPreviews] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const maxSizeMB = 500;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const arquivosValidos = acceptedFiles.filter((file) => {
      if (file.size > maxSizeBytes) {
        toast.error(
          `O arquivo "${file.name}" excede o limite de 500MB. Por favor, envie um arquivo menor.`
        );
        return false;
      }
      return true;
    });

    setPreviews(arquivosValidos);
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

    try {
      NProgress.start();

      for (const file of previews) {
        const formData = new FormData();
        formData.append("arquivo", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erro no upload");
        }
      }

      setPreviews([]);
      setModalAberto(true);
    } catch (error) {
      alert("Erro ao enviar os arquivos.");
      console.error(error);
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

        <button
          type="submit"
          className={styles.button}
          disabled={previews.length === 0}
        >
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
      <ToastContainer />
    </main>
  );
}
