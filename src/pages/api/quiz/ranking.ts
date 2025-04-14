import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

type ResultadoQuiz = {
  nome: string;
  acertos: number;
  total: number;
  tipo: string;
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tipo } = req.query;

  if (typeof tipo !== "string" || !["noivo", "noiva", "casal"].includes(tipo)) {
    return res.status(400).json({ mensagem: "Tipo de quiz inválido." });
  }

  const filePath = path.join(process.cwd(), "data", "quiz", `${tipo}.json`);

  try {
    const conteudo = await fs.readFile(filePath, "utf-8");
    const resultados: ResultadoQuiz[] = JSON.parse(conteudo);

    const ranking = resultados
      .sort((a, b) => {
        if (b.acertos !== a.acertos) {
          return b.acertos - a.acertos; // mais acertos primeiro
        }
        return Date.parse(a.data) - Date.parse(b.data); // mais antigo primeiro
      })
      .slice(0, 10); // top 10

    return res.status(200).json(ranking);
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    return res.status(200).json([]); // retorna lista vazia em caso de erro
  }
}
