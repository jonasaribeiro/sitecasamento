import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

type ResultadoQuiz = {
  nome: string;
  acertos: number;
  total: number;
  tipo: "noivo" | "noiva" | "casal";
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  const { nome, acertos, total, tipo } = req.body;

  if (!nome || (!acertos && acertos !== 0) || !total || !tipo) {
    return res.status(400).json({ mensagem: "Dados inválidos" });
  }

  const resultado: ResultadoQuiz = {
    nome,
    acertos,
    total,
    tipo,
    data: new Date().toISOString(),
  };

  const filePath = path.join(process.cwd(), "data", "quiz", `${tipo}.json`);

  try {
    // Verifica se o arquivo já existe
    let dadosExistentes: ResultadoQuiz[] = [];
    try {
      const json = await fs.readFile(filePath, "utf-8");
      dadosExistentes = JSON.parse(json);
    } catch {
      // Se o arquivo não existir, cria do zero
      dadosExistentes = [];
    }

    // Adiciona o novo resultado
    dadosExistentes.push(resultado);

    // Salva novamente
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(dadosExistentes, null, 2));

    return res.status(200).json({ mensagem: "Resultado salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar resultado:", err);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}
