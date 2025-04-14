import Masonry from "react-masonry-css";
import styles from "./galeria.module.css";

const imagensExemplo = [
  "https://picsum.photos/300/400",
  "https://picsum.photos/400/300",
  "https://picsum.photos/300/300",
  "https://picsum.photos/250/350",
  "https://picsum.photos/350/250",
  "https://picsum.photos/320/400",
  "https://picsum.photos/400/400",
  "https://picsum.photos/280/280",
  "https://picsum.photos/360/240",
];

const breakpointColumnsObj = {
  default: 3,
  960: 2,
  640: 1,
};

export default function GaleriaPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🧱 Mural do Casal</h1>
        <p className={styles.subtitle}>
          Veja os momentos especiais de Jonas & Mariana! 🧡
        </p>
      </header>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.grid}
        columnClassName={styles.column}
      >
        {imagensExemplo.map((src, index) => (
          <div key={index} className={styles.card}>
            <img src={src} alt={`Foto ${index + 1}`} className={styles.image} />
          </div>
        ))}
      </Masonry>
    </main>
  );
}
