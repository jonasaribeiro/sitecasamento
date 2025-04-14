import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";
import { adaptMulter } from "@/lib/nextMulter";
import { uploadToGCS } from "@/lib/googleCloud";

// Multer salva o arquivo em /tmp
const upload = multer({ dest: "/tmp" });

// Define tipos com Next.js
type NextApiRequestWithFile = NextApiRequest & {
  file: Express.Multer.File;
};

// Cria o router
const router = createRouter<NextApiRequestWithFile, NextApiResponse>();

// Middleware do multer (.single = 1 arquivo por vez)
router.use(adaptMulter(upload.single("arquivo")));

// POST /api/upload
router.post(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ erro: "Nenhum arquivo enviado" });
  }

  const mime = file.mimetype;
  const ext = path.extname(file.originalname);
  const nomePadronizado = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
  const localPath = file.path;

  let destino = "";
  if (mime.startsWith("image/")) {
    destino = `fotos/${nomePadronizado}`;
  } else if (mime.startsWith("video/")) {
    destino = `videos/${nomePadronizado}`;
  } else {
    fs.unlinkSync(localPath);
    return res.status(400).json({ erro: "Tipo de arquivo não suportado" });
  }

  try {
    const url = await uploadToGCS(localPath, destino);
    fs.unlinkSync(localPath); // limpa o arquivo local
    res.status(200).json({ mensagem: "Upload concluído", url });
  } catch (err) {
    console.error("Erro ao enviar para o bucket:", err);
    res.status(500).json({ erro: "Erro ao enviar para o Google Cloud" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error("Erro interno:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ erro: "Método não permitido" });
  },
});

// Desativa o bodyParser padrão do Next
export const config = {
  api: {
    bodyParser: false,
  },
};
