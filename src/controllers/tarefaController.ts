import { Request, Response } from "express";
import prisma from "../prismaClient";

//função para criar nova tarefa
export const createTarefa = async (req: Request, res: Response) => {
  const { nome } = req.body;

  try {
    const tarefa = await prisma.tarefa.create({
      data: {
        nome,
      },
    });
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tarefa." });
  }
};
//função para listar todas as tarefa
export const getAllTarefas = async (req: Request, res: Response) => {
  try {
    const tarefas = await prisma.tarefa.findMany();
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas." });
  }
};
//função para listar apenas uma tarefa
export const getTarefaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tarefa = await prisma.tarefa.findUnique({
      where: { id },
    });
    if (!tarefa) {
      res.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }
    res.status(200).json(tarefa);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefa." });
  }
};
//função para atualizar uma tarefa
export const updateTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    // Primeiro, tenta encontrar a tarefa pelo ID
    const tarefa = await prisma.tarefa.findUnique({
      where: { id },
    });

    // Verifica se a tarefa existe
    if (!tarefa) {
      res.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }

    // Se a tarefa existir, procede com a atualização
    const updatedTarefa = await prisma.tarefa.update({
      where: { id },
      data: { nome },
    });

    res.status(200).json(updatedTarefa);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar tarefa." });
  }
};
//função para deletar uma tarefa
export const deleteTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Primeiro, tenta encontrar a tarefa pelo ID
    const tarefa = await prisma.tarefa.findUnique({
      where: { id },
    });

    // Verifica se a tarefa existe
    if (!tarefa) {
      res.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }

    // Se a tarefa existir, procede com a deleção
    await prisma.tarefa.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir tarefa." });
  }
};
