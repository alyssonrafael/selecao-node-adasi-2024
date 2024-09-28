// src/middleware/cursoMiddleware.ts
import { Request, Response, NextFunction } from "express";

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
