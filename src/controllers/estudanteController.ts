import { Request, Response } from "express";
import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";

//função para criar novo estudante
export const createEstudante = async (req: Request, res: Response) => {
  const { cpf, nome, matricula, cursoId } = req.body;

  try {
    const estudante = await prisma.estudante.create({
      data: {
        cpf,
        nome,
        matricula,
        cursoId,
      },
    });
    res.status(201).json(estudante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro ao criar o estudante." });
  }
};
//função para listar todos os estudantes
export const getAllEstudantes = async (req: Request, res: Response) => {
  try {
    const estudantes = await prisma.estudante.findMany({
      // incluindo o nome do curso para facilitar o acesso para o frontend
      include: {
        curso: {
          select: {
            nome: true,
          },
        },
      },
    });
    res.json(estudantes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocorreu um erro ao buscar os estudantes." });
  }
};
//função para listar um estudante especifico
export const getEstudanteByCpf = async (req: Request, res: Response) => {
  const { cpf } = req.params;

  try {
    const estudante = await prisma.estudante.findUnique({
      where: { cpf },
      // incluindo o nome do curso para facilitar o acesso para o frontend
      include: {
        curso: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!estudante) {
      res.status(404).json({ message: "Estudante não encontrado." });
      return;
    }

    res.json(estudante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro ao buscar o estudante." });
  }
};
//funçao para atualizar o nome e o curso do estudante
export const updateEstudante = async (req: Request, res: Response) => {
  const { cpf } = req.params;
  const { nome, cursoId } = req.body;

  try {
    const estudante = await prisma.estudante.update({
      where: { cpf },
      data: {
        nome,
        cursoId,
      },
    });
    res.json(estudante);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar estudante." });
  }
};
//função para deletar um estudante
export const deleteEstudante = async (req: Request, res: Response) => {
  const { cpf } = req.params;

  try {
    await prisma.estudante.delete({
      where: { cpf },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Verifica se o código de erro é P2025 codigo de erro do prisma para nao encontrado
      if (error.code === "P2025") {
        res.status(404).json({ message: "Estudante não encontrado." });
        return;
      }
    }
    // Se não for um erro conhecido, retorna erro genérico
    res.status(500).json({ message: "Erro ao excluir estudante." });
  }
};
