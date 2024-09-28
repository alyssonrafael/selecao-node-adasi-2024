import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient";

//middleware para validar a criação de um curso
export const validateCurso = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { nome } = req.body;

  if (!nome) {
    res.status(400).json({ error: "O nome do curso é obrigatório" });
    return;
  }

  if (typeof nome !== "string" || nome.trim() === "") {
    res
      .status(400)
      .json({ error: "O nome do curso deve ser uma string não vazia" });
    return;
  }
  // Chama next() para continuar o fluxo
  next();
};

// Middleware para validar a deleção de um curso
export const validateCursoDeletar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    // Verifica se há estudantes associados ao curso
    const estudanteCount = await prisma.estudante.count({
      where: { cursoId: id },
    });

    if (estudanteCount > 0) {
      res.status(400).json({ error: "Não é possível deletar o curso. Existem estudantes associados." });
      return;
    }

    // Chama next() para continuar o fluxo
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao verificar estudantes associados." });
  }
};
