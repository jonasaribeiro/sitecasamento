import type { NextApiRequest, NextApiResponse } from "next";
import { listImagesFromGCS } from "@/lib/googleCloud";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page = "1", limit = "15" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  try {
    const resultado = await listImagesFromGCS(pageNumber, limitNumber);
    res.status(200).json(resultado);
  } catch (err) {
    console.error("Erro ao carregar galeria:", err);
    res.status(500).json({ erro: "Erro ao carregar fotos" });
  }
}
