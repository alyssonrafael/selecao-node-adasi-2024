import { Router } from "express";
import {
  createTarefa,
  getAllTarefas,
  getTarefaById,
  updateTarefa,
  deleteTarefa,
} from "../controllers/tarefaController";
import { validateTarefa, verificarAtividadesAssociadasTarefa } from "../middleware/tarefaMiddleware";

const router = Router();

// Rota para criar uma nova tarefa usa o middleware para validar a entrada
router.post("/tarefa", validateTarefa, createTarefa);

// Rota para listar todas as tarefas
router.get("/tarefas", getAllTarefas);

// Rota para buscar uma tarefa por ID
router.get("/tarefa/:id", getTarefaById);

// Rota para atualizar uma tarefa usa o middleware para validar a entrada
router.put("/tarefa/:id", validateTarefa, updateTarefa);

// Rota para deletar uma tarefa usa o middleware para verificar se ha alguma atividade associada
router.delete("/tarefa/:id",verificarAtividadesAssociadasTarefa, deleteTarefa);

export default router;
