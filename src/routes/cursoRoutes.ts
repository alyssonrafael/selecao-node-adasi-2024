// src/routes/cursoRoutes.ts
import { Router } from 'express';
import { createCurso } from '../controllers/cursoController';
import { validateCurso } from '../middleware/cursoMiddleware';

const router = Router();

//rota para criar um novo curso e usa o middleware para validar a criação
router.post('/cursos', validateCurso, createCurso);

export default router;