import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';

// Middleware para validar o nome da tarefa
export const validateTarefa = (req: Request, res: Response, next: NextFunction): void => {
  const { nome } = req.body;

  // Verifica se o campo nome está presente e se não é uma string vazia
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
     res.status(400).json({ message: 'O campo nome é obrigatório e não pode ser vazio.' });
     return
  }

  // Se estiver tudo certo, passa para o próximo middleware ou controller
  next();
};

// Middleware para verificar se uma tarefa possui atividades associadas
export const verificarAtividadesAssociadasTarefa = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params; // Pega o ID da tarefa da URL

  try {
    // Verifica se a tarefa possui atividades associadas
    const atividades = await prisma.atividade.findMany({
      where: { tarefaId: id },
    });

    if (atividades.length > 0) {
       res.status(400).json({
        message: "A tarefa não pode ser excluída pois possui atividades associadas.",
      });
      return
    }

    next(); // Chama o próximo middleware ou a função de controle
  } catch (error) {
    console.error("Erro ao verificar atividades associadas:", error);
    res.status(500).json({ message: "Erro ao verificar atividades." });
  }
};
