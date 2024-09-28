// src/routes/estudanteRoutes.ts
import { Router } from 'express';
import {
  createEstudante,
  deleteEstudante,
  getAllEstudantes,
  getEstudanteByCpf,
  updateEstudante,
} from '../controllers/estudanteController';
import {validateEstudante, validateUpdateEstudante, verificarAtividadesAssociadas} from '../middleware/estudanteMiddleware'; 

const router = Router();
//rota para cadastrar estudante com a validação do middleware
router.post('/estudante', validateEstudante, createEstudante);
//rota para listar todos os estudantes
router.get('/estudantes', getAllEstudantes)
//rota para listar um estudante especifico
router.get('/estudante/:cpf', getEstudanteByCpf)
//rota para atualizar informeções de um estudante
router.put('/estudante/:cpf',validateUpdateEstudante, updateEstudante)
//rota para deletar estudante usa o middleware para verificar se ha alguma atividade associada
router.delete('/estudante/:cpf',verificarAtividadesAssociadas, deleteEstudante)


export default router;
