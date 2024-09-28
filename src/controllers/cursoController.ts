// src/controllers/cursoController.ts
import { Request, Response } from "express";
import prisma from "../prismaClient";


//função para criar um novo curso
export const createCurso = async (req: Request, res: Response) => {
  const { nome } = req.body;
  try {
    const novoCurso = await prisma.curso.create({
      data: { nome },
    });
    res.status(201).json(novoCurso);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar curso" });
  }
};
