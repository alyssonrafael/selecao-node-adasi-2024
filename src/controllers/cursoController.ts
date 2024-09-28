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

// Listar todos os cursos
export const getAllCursos = async (req: Request, res: Response) => {
  try {
    const cursos = await prisma.curso.findMany();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os cursos' });
  }
};

// Obter um curso específico
export const getCursoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const curso = await prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
       res.status(404).json({ error: 'Curso não encontrado' });
       return
    }

    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o curso' });
  }
};

// Atualizar um curso
export const updateCurso = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const cursoExistente = await prisma.curso.findUnique({
      where: { id },
    });

    if (!cursoExistente) {
       res.status(404).json({ error: 'Curso não encontrado' });
       return
    }

    const cursoAtualizado = await prisma.curso.update({
      where: { id },
      data: { nome },
    });

    res.status(200).json(cursoAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o curso' });
  }
};

// Deletar um curso
export const deleteCurso = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cursoExistente = await prisma.curso.findUnique({
      where: { id },
    });

    if (!cursoExistente) {
      res.status(404).json({ error: 'Curso não encontrado' });
      return
    }

    await prisma.curso.delete({
      where: { id },
    });

    res.status(204).send(); // Retorna 204 No Content informando que deu tudo certo
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o curso' });
  }
};
