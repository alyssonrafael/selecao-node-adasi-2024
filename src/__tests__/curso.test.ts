import request from "supertest";
import app from "../index";
import prisma from "../prismaClient";

afterAll(async () => {
  // Limpar os dados após os testes
  await prisma.estudante.deleteMany({});
  await prisma.curso.deleteMany({});
});

describe("Teste de Curso", () => {
  
  it("deve criar um novo curso", async () => {
    const novoCurso = {
      nome: "Curso de Teste",
    };

    const response = await request(app).post("/api/cursos").send(novoCurso);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.nome).toBe(novoCurso.nome);
  });

  it("deve listar todos os cursos", async () => {
    const response = await request(app).get("/api/cursos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve retornar um curso específico", async () => {
    const novoCurso = { nome: "Curso de Teste" };

    const createResponse = await request(app)
      .post("/api/cursos")
      .send(novoCurso);
    const cursoId = createResponse.body.id;

    const response = await request(app).get(`/api/curso/${cursoId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", cursoId);
    expect(response.body.nome).toBe(novoCurso.nome);
  });

  it("deve atualizar um curso existente", async () => {
    const novoCurso = { nome: "Curso de Teste" };

    const createResponse = await request(app)
      .post("/api/cursos")
      .send(novoCurso);
    const cursoId = createResponse.body.id;

    const updatedCurso = { nome: "Curso Atualizado" };
    const response = await request(app)
      .put(`/api/curso/${cursoId}`)
      .send(updatedCurso);

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe(updatedCurso.nome);
  });

  //esse teste ira falhar se o curso tiver algum aluno associado por conta do middleware
  it("deve deletar um curso existente", async () => {
    const novoCurso = { nome: "Curso de Teste" };

    const createResponse = await request(app)
      .post("/api/cursos")
      .send(novoCurso);
    const cursoId = createResponse.body.id;

    const response = await request(app).delete(`/api/curso/${cursoId}`);

    expect(response.status).toBe(204); // Expectativa para status 204 No Content

    // Verifica se o curso foi realmente deletado
    const getResponse = await request(app).get(`/api/curso/${cursoId}`);
    expect(getResponse.status).toBe(404); // Espera que não encontre o curso
  });

  it("deve retornar 404 ao buscar um curso inexistente", async () => {
    const response = await request(app).get("/api/curso/12345678"); // ID que não existe
    expect(response.status).toBe(404);
  });

  it("deve retornar 404 ao buscar um curso inexistente", async () => {
    const response = await request(app).put("/api/cursos/12345678"); // ID que não existe
    expect(response.status).toBe(404);
  });

  it("deve retornar 404 ao tentar deletar um curso inexistente", async () => {
    const response = await request(app).delete("/api/curso/12345678"); // ID que não existe
    expect(response.status).toBe(404);
  });
});

describe("Middleware validateCurso", () => {
  it("deve retornar 400 se o nome do curso não for fornecido", async () => {
    const response = await request(app)
      .post("/api/cursos") // Ou a rota que usa o middleware
      .send({}); // Enviando um corpo vazio
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("O nome do curso é obrigatório");
  });

  it("deve retornar 400 se o nome do curso não for uma string", async () => {
    const response = await request(app).post("/api/cursos").send({ nome: 123 }); // Enviando um número em vez de uma string
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O nome do curso deve ser uma string não vazia"
    );
  });

  it("deve continuar o fluxo se o nome do curso for válido", async () => {
    const response = await request(app)
      .post("/api/cursos")
      .send({ nome: "Curso Válido" }); // Enviando um nome válido
    expect(response.status).toBe(201); // Aqui você espera o status de sucesso da criação
  });
});

