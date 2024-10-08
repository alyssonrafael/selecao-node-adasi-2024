// src/routes/cursoRoutes.ts
import { Router } from "express";
import {
  createCurso,
  deleteCurso,
  getAllCursos,
  getCursoById,
  updateCurso,
} from "../controllers/cursoController";
import { validateCurso, validateCursoDeletar } from "../middleware/cursoMiddleware";

const router = Router();

//rota para criar um novo curso e usa o middleware para validar a criação
router.post("/cursos", validateCurso, createCurso);
//rota para listar todos os cursos
router.get("/cursos", getAllCursos);
//rota para listar curso especifico
router.get("/curso/:id", getCursoById);
//rota para atualizar um curso
router.put("/curso/:id",validateCurso, updateCurso);
//rota para deletar um curso com validação se existem estudantes associados
router.delete("/curso/:id",validateCursoDeletar, deleteCurso);

export default router;
