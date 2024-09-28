import { Request, Response } from "express";
import prisma from "../prismaClient";

// Criar uma nova atividade
export const createAtividade = async (req: Request, res: Response) => {
  const {
    tarefaId,
    estudanteId,
    data,
    horaAgendamentoInicio,
    horaAgendamentoTermino,
  } = req.body;

  try {
    const novaAtividade = await prisma.atividade.create({
      data: {
        tarefaId,
        estudanteId,
        data: new Date(data), // Convere a string da data para um objeto Date que sera salvo no banco com o formato aaaa/mm/dd
        horaAgendamentoInicio: new Date(`1970-01-01T${horaAgendamentoInicio}Z`), // Usa uma data para fins de criaçao no banco de dados mas oque sera salvo e apenas o time
        horaAgendamentoTermino: new Date(
          `1970-01-01T${horaAgendamentoTermino}Z`
        ), // Usa uma data para fins de criaçao no banco de dados mas oque sera salvo e apenas o time
      },
    });
    res.status(201).json(novaAtividade);
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    res.status(500).json({ message: "Erro ao criar atividade." });
  }
};

// Listar todas as atividades
export const getAllAtividades = async (req: Request, res: Response) => {
  try {
    const atividades = await prisma.atividade.findMany({
      // inclue os campode ed nome do estudante e da tarefa para facilitar o acesso no forntend
      include: {
        estudante: {
          select: {
            nome: true,
          },
        },
        tarefa: {
          select: {
            nome: true,
          },
        },
      },
    });
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar atividades." });
  }
};

// Listar uma atividade específica
export const getAtividadeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const atividade = await prisma.atividade.findUnique({
      where: { id },
      // inclue os campode ed nome do estudante e da tarefa para facilitar o acesso no forntend
      include: {
        estudante: {
          select: {
            nome: true,
          },
        },
        tarefa: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!atividade) {
      res.status(404).json({ message: "Atividade não encontrada." });
      return;
    }

    res.json(atividade);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar atividade." });
  }
};

// Atualizar uma atividade
export const updateAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    tarefaId,
    estudanteId,
    data,
    horaAgendamentoInicio,
    horaAgendamentoTermino,
  } = req.body;

  try {
    const atividade = await prisma.atividade.findUnique({
      where: { id },
    });

    if (!atividade) {
      res.status(404).json({ message: "Atividade não encontrada." });
      return;
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id },
      data: {
        tarefaId,
        estudanteId,
        data: new Date(data), // Converte a string da data para um objeto Date que sera salvo no banco como aaaa/mm/dd
        horaAgendamentoInicio: new Date(`1970-01-01T${horaAgendamentoInicio}Z`), // Adiciona "Z" para UTC, sera salvo no banco apenas o time
        horaAgendamentoTermino: new Date(
          `1970-01-01T${horaAgendamentoTermino}Z`
        ), // Adiciona "Z" para UTC, sera salvo no banco apenas o time
      },
    });

    res.json(atividadeAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    res.status(500).json({ message: "Erro ao atualizar atividade." });
  }
};

// Deletar uma atividade
export const deleteAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const atividade = await prisma.atividade.findUnique({
      where: { id },
    });

    if (!atividade) {
      res.status(404).json({ message: "Atividade não encontrada." });
      return;
    }

    await prisma.atividade.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir atividade." });
  }
};

// Iniciar uma atividade
export const iniciarAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { horaInicio } = req.body; // Receber a hora de início

  try {
    const atividade = await prisma.atividade.findUnique({
      where: { id },
    });

    if (!atividade) {
      res.status(404).json({ message: "Atividade não encontrada." });
      return;
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id },
      data: {
        horaInicio: new Date(`1970-01-01T${horaInicio}Z`), // Converte a hora para UTC sera gravado no banco no formato time
      },
    });
    res.json(atividadeAtualizada);
  } catch (error) {
    console.error("Erro ao iniciar atividade:", error);
    res.status(500).json({ message: "Erro ao iniciar atividade." });
  }
};

// Finalizar uma atividade
export const finalizarAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { horaTermino } = req.body; // Receber a hora de término

  try {
    const atividade = await prisma.atividade.findUnique({
      where: { id },
    });

    if (!atividade) {
      res.status(404).json({ message: "Atividade não encontrada." });
      return;
    }

    const atividadeAtualizada = await prisma.atividade.update({
      where: { id },
      data: {
        horaTermino: new Date(`1970-01-01T${horaTermino}Z`), // Converte a hora para UTC, sera gravado no banco no formato time
      },
    });
    res.json(atividadeAtualizada);
  } catch (error) {
    console.error("Erro ao finalizar atividade:", error);
    res.status(500).json({ message: "Erro ao finalizar atividade." });
  }
};
