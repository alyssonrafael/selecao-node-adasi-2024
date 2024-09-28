// src/middleware/validateEstudante.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';
//validações para criação de estudante
const validateEstudante = async (req: Request, res: Response, next: NextFunction) => {
  const { cpf, nome, matricula, cursoId } = req.body;

  // Verifica se todos os campos obrigatórios estão presentes e não são strings vazias
  if (!cpf || !nome || !matricula || !cursoId || 
      typeof cpf !== 'string' || cpf.trim() === '' ||
      typeof nome !== 'string' || nome.trim() === '' ||
      typeof matricula !== 'string' || matricula.trim() === '' ||
      typeof cursoId !== 'string' || cursoId.trim() === '') {
     res.status(400).json({ message: 'Todos os campos são obrigatórios: cpf, nome, matrícula e cursoId, e não podem ser vazios.' });
     return
  }

  // Verifica se o CPF já está cadastrado
  const estudanteExistente = await prisma.estudante.findUnique({
    where: { cpf },
  });
  if (estudanteExistente) {
     res.status(400).json({ message: 'Já existe um estudante cadastrado com esse CPF.' });
     return
  }

  // Verifica se a matrícula já está cadastrada
  const matriculaExistente = await prisma.estudante.findUnique({
    where: { matricula },
  });
  if (matriculaExistente) {
     res.status(400).json({ message: 'Já existe um estudante cadastrado com essa matrícula.' });
     return
  }

  // Verifica se o curso existe
  const cursoExistente = await prisma.curso.findUnique({
    where: { id: cursoId },
  });
  if (!cursoExistente) {
     res.status(400).json({ message: 'Curso não existente.' });
     return
  }

  // Se todas as validações passarem, chama o próximo middleware
  next();
};
//validações para atualização de estudadnte
const validateUpdateEstudante = async (req: Request, res: Response, next: NextFunction) => {
  const { nome, cursoId } = req.body;

  // Verifica se o campo nome é fornecido e não é vazio
  if (!nome || (typeof nome !== 'string' || nome.trim() === '')) {
     res.status(400).json({ message: 'O campo nome é obrigatório e não pode ser vazio ou apenas espaços em branco.' });
     return
  }

  // Verifica se o cursoId é fornecido e não é vazio
  if (!cursoId || (typeof cursoId !== 'string' || cursoId.trim() === '')) {
     res.status(400).json({ message: 'O campo cursoId é obrigatório e não pode ser vazio ou apenas espaços em branco.' });
     return
  }

  // Verifica se o curso existe
  const cursoExistente = await prisma.curso.findUnique({
    where: { id: cursoId },
  });
  if (!cursoExistente) {
     res.status(400).json({ message: 'Curso não existente.' });
     return
  }

  // Se todas as validações passarem, chama o próximo middleware
  next();
};

// Middleware para verificar se um estudante possui atividades associadas
 const verificarAtividadesAssociadas = async (
   req: Request,
   res: Response,
   next: NextFunction
 ) => {
   const { cpf } = req.params; // Pega o CPF do estudante da URL
 
   try {
     // Verifica se o estudante possui atividades associadas
     const atividades = await prisma.atividade.findMany({
       where: { estudanteId: cpf },
     });
 
     if (atividades.length > 0) {
        res.status(400).json({
         message: "O estudante não pode ser excluído pois possui atividades associadas.",
       });
       return
     }
 
     next(); // Chama o próximo middleware ou a função de controle
   } catch (error) {
     console.error("Erro ao verificar atividades associadas:", error);
     res.status(500).json({ message: "Erro ao verificar atividades." });
   }
 };

export { validateEstudante, validateUpdateEstudante, verificarAtividadesAssociadas };