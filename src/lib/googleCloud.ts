import path from "path";
import { Storage } from "@google-cloud/storage";

// Caminho absoluto da chave
const keyPath = path.join(process.cwd(), "gcp", "chave.json");

// Inicializa o client do GCS
const storage = new Storage({
  keyFilename: keyPath,
});

const bucket = storage.bucket("casamentomarianaejonas");

export async function uploadToGCS(
  localFilePath: string,
  destinationPath: string
) {
  await bucket.upload(localFilePath, {
    destination: destinationPath,
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  return `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
}

export async function listImagesFromGCS(page: number, limit: number) {
  const [files] = await bucket.getFiles({ prefix: "fotos/" });

  const imagens = files
    .filter((f) => f.name.match(/\.(jpg|jpeg|png|webp)$/i))
    .map((f) => `https://storage.googleapis.com/${bucket.name}/${f.name}`)
    .reverse(); // Mostra as mais recentes primeiro

  const startIndex = (page - 1) * limit;
  const paginadas = imagens.slice(startIndex, startIndex + limit);
  const temMais = startIndex + limit < imagens.length;

  return { imagens: paginadas, temMais };
}
