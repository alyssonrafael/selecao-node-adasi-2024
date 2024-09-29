import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient"; // Ajuste o caminho conforme necessário

// Middleware para validar campos na criação e atualização de atividades para garantir que nao sejam enviados vazios
export const validateAtividadeFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    tarefaId,
    estudanteId,
    data,
    horaAgendamentoInicio,
    horaAgendamentoTermino,
  } = req.body;

  // Verificar se os campos são preenchidos
  if (
    !tarefaId ||
    !estudanteId ||
    !data ||
    !horaAgendamentoInicio ||
    !horaAgendamentoTermino
  ) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  // Verificar se a tarefa existe
  const tarefaExists = await prisma.tarefa.findUnique({
    where: { id: tarefaId },
  });

  if (!tarefaExists) {
    res.status(404).json({ error: "Tarefa não encontrada." });
    return;
  }

  // Verificar se o estudante existe
  const estudanteExists = await prisma.estudante.findUnique({
    where: { cpf: estudanteId },
  });

  if (!estudanteExists) {
    res.status(404).json({ error: "Estudante não encontrado." });
    return;
  }

  next(); // Chama o próximo middleware ou a função de controle
};

// Middleware para validar início e finalização de atividades garantir que os campos nao vao ser vazios
export const validateInicioFinalizacao = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { horaInicio, horaTermino } = req.body;

  // Verificar se os campos não estão vazios
  if (!horaInicio && !horaTermino) {
    res
      .status(400)
      .json({ error: "Hora de início e(ou) hora de término são obrigatórias." });
    return;
  }

  next(); // Chama o próximo middleware ou a função de controle
};

// Middleware para validar a duração da atividade 6h utilizado na criação do agendamento
export const validateDuracaoAtividade = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, horaAgendamentoInicio, horaAgendamentoTermino } = req.body;

  const dataInicio = new Date(`${data}T${horaAgendamentoInicio}Z`); //conversao para UTC
  const dataTermino = new Date(`${data}T${horaAgendamentoTermino}Z`); //conversao para UTC

  const duracao =
    (dataTermino.getTime() - dataInicio.getTime()) / (1000 * 60 * 60); // Duração em horas

  if (duracao > 6) {
    res.status(400).json({
      message: "A duração da atividade não pode ultrapassar 6 horas.",
    });
    return;
  }

  next();
};

// Middleware para validar que a hora de termino nao vai er anterior nem igual a hora de inicio
export const validateDataHora = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, horaAgendamentoInicio, horaAgendamentoTermino } = req.body;

  const dataInicio = new Date(`${data}T${horaAgendamentoInicio}Z`);
  const dataTermino = new Date(`${data}T${horaAgendamentoTermino}Z`);

  if (dataTermino <= dataInicio) {
    res.status(400).json({
      message:
        "A data e hora de término não podem ser anteriores e nem iguais à data e hora de início.",
    });
    return;
  }

  next();
};

// Middleware para validar tolerância de início de atividades
export const validateToleranciaInicio = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // ID da atividade
    const { horaInicio } = req.body; // Hora de início recebida no corpo da requisição
  
    try {
      // Buscar a atividade pelo ID
      const atividade = await prisma.atividade.findUnique({
        where: { id },
        select: { horaAgendamentoInicio: true }, // Selecionar apenas a hora de agendamento
      });
  
     
      
      // Verificar se a atividade existe
      if (!atividade) {
         res.status(404).json({ message: "Atividade não encontrada." });
         return
      }
  
      const horaAgendamentoInicio = atividade.horaAgendamentoInicio; // Hora de agendamento do banco
      const horaAgendamentoInicioDate = new Date(horaAgendamentoInicio); // Converter para Date
  
      // Tolerância de 15 minutos
      const tolerancia = 15 * 60 * 1000; // em milissegundos
  
      // Converter a hora de início recebida para Date UTC
      const horaInicioDate = new Date(`1970-01-01T${horaInicio}Z`);
  
      // Verificar se a hora de início está dentro da tolerância
      if (
        horaInicioDate.getTime() <= horaAgendamentoInicioDate.getTime() - tolerancia ||
        horaInicioDate.getTime() >= horaAgendamentoInicioDate.getTime() + tolerancia
      ) {
         res.status(400).json({
          message:
            "A atividade só pode ser iniciada com uma tolerância de 15 minutos para mais ou para menos em relação à hora de agendamento.",
        });
        return
      }
  
      next(); // Chama o próximo middleware ou a função de controle
    } catch (error) {
      console.error("Erro ao validar tolerância de início:", error);
      res.status(500).json({ message: "Erro ao validar tolerância de início." });
    }
  };

// Middleware para validar encerramento de atividades
export const validateEncerramento = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params; 
  const { horaTermino } = req.body; // Pega a hora de término do corpo da requisição
  
  try {
      // Busca a atividade no banco de dados
      const atividade = await prisma.atividade.findUnique({
          where: { id },
          select: { horaInicio: true, horaAgendamentoInicio: true }, // Seleciona a hora de início e hora de agendamento
      });

      // Verifica se a atividade existe
      if (!atividade) {
          res.status(404).json({ error: "Atividade não encontrada." });
          return;
      }

      // Verifica se a atividade foi iniciada
      if (!atividade.horaInicio) {
          res.status(400).json({ error: "A atividade deve ser iniciada antes de ser encerrada." });
          return;
      }

      // Converte a hora de início, hora de agendamento e hora de término para o formato Date
      const horaInicioDate = new Date(`${atividade.horaInicio}`);
      const horaAgendamentoInicioDate = new Date(`${atividade.horaAgendamentoInicio}`);
      const horaTerminoDate = new Date(`1970-01-01T${horaTermino}Z`); // Usa 'Z' para UTC

      // Verifica se a hora de término é posterior à hora de início e à hora de agendamento
      if (horaTerminoDate <= horaInicioDate || horaTerminoDate <= horaAgendamentoInicioDate) {
          res.status(400).json({ error: "A hora de término deve ser posterior à hora de início e à hora de agendamento." });
          return;
      }

      next(); // Chama o próximo middleware ou a função de controle
  } catch (error) {
      console.error("Erro ao validar encerramento da atividade:", error);
      res.status(500).json({ message: "Erro ao validar encerramento da atividade." });
  }
};