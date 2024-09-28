import { Router } from "express";
import {
  createAtividade,
  getAllAtividades,
  updateAtividade,
  deleteAtividade,
  iniciarAtividade,
  finalizarAtividade,
  getAtividadeById,
} from "../controllers/atividadeController";
import {
  validateAtividadeFields,
  validateDataHora,
  validateDuracaoAtividade,
  validateEncerramento,
  validateInicioFinalizacao,
  validateToleranciaInicio,
} from "../middleware/atividadeMiddleware";

const router = Router();

// Rota para criar uma atividade utiliza 3 middlewares
router.post(
  "/atividade",
  validateAtividadeFields,
  validateDuracaoAtividade,
  validateDataHora,
  createAtividade
);

// Rota para listar todas as atividades
router.get("/atividades", getAllAtividades);

// Rota para listar apenas 1  atividade
router.get("/atividade/:id", getAtividadeById);

// Rota para atualizar uma atividade, utiliza 3 middlewares
router.put(
  "/atividade/:id",
  validateAtividadeFields,
  validateDuracaoAtividade,
  validateDataHora,
  updateAtividade
);

// Rota para deletar uma atividade
router.delete("/atividade/:id", deleteAtividade);

// Rota para iniciar uma atividade utiliza 2 middlewares
router.patch(
  "/atividade/:id/iniciar",
  validateInicioFinalizacao,
  validateToleranciaInicio,
  iniciarAtividade
);

// Rota para finalizar uma atividade utiliza 2 middlewares
router.patch(
  "/atividade/:id/finalizar",
  validateInicioFinalizacao,
  validateEncerramento,
  finalizarAtividade
);

export default router;
