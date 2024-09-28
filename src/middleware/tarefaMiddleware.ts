import { Request, Response, NextFunction } from 'express';

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
