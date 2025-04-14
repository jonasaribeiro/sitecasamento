import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

type Mensagem = {
  nome: string;
  mensagem: string;
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido" });
  }

  const { nome, mensagem } = req.body;

  if (!mensagem || typeof mensagem !== "string") {
    return res.status(400).json({ mensagem: "Mensagem inválida" });
  }

  const nomeFinal =
    typeof nome === "string" && nome.trim() !== "" ? nome.trim() : "Anônimo";

  const novaMensagem: Mensagem = {
    nome: nomeFinal,
    mensagem: mensagem.trim(),
    data: new Date().toISOString(),
  };

  const filePath = path.join(process.cwd(), "data", "mensagens.json");

  try {
    let mensagens: Mensagem[] = [];

    try {
      const existente = await fs.readFile(filePath, "utf-8");
      mensagens = JSON.parse(existente);
    } catch {
      mensagens = [];
    }

    mensagens.push(novaMensagem);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(mensagens, null, 2));

    return res.status(200).json({ mensagem: "Mensagem salva com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    return res.status(500).json({ mensagem: "Erro ao salvar mensagem" });
  }
}
