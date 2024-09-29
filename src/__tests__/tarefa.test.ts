import request from 'supertest';
import app from '../index';
import prisma from '../prismaClient';

let tarefaId: string;

afterAll(async () => {
  // Limpar os dados após os testes
  await prisma.tarefa.deleteMany({});
});

describe("Tarefas", () => {
  beforeAll(async () => {
    // Crie uma tarefa antes dos testes
    const response = await request(app).post("/api/tarefa").send({
      nome: "Tarefa de Teste",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    // Captura o ID da tarefa criada
    tarefaId = response.body.id;
  });

  describe("POST /api/tarefa", () => {
    it("deve criar uma tarefa com sucesso", async () => {
      const response = await request(app).post('/api/tarefa').send({
        nome: "Nova Tarefa",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
    it("não deve criar uma tarefa com nome vazio", async () => {
        const response = await request(app).post('/api/tarefa').send({
          nome: "", // Passando uma string vazia
        });
    
        expect(response.status).toBe(400);
      });
  });

  describe("GET /api/tarefas", () => {
    it("deve retornar todas as tarefas", async () => {
      const response = await request(app).get('/api/tarefas');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/tarefa/:id", () => {
    it("deve retornar tarefa expecifica", async () => {
      const response = await request(app).get(`/api/tarefa/${tarefaId}`);
      expect(response.status).toBe(200);
    });

    it("deve retornar erro 404 ao buscar a tarefa especifica", async () => {
      const response = await request(app).get(`/api/tarefa/invalid-id`); //id invalido
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/tarefa/:id", () => {
    it("deve atualizar uma tarefa com sucesso", async () => {
      const response = await request(app)
        .put(`/api/tarefa/${tarefaId}`)
        .send({
          nome: "Tarefa Atualizada",
        });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nome", "Tarefa Atualizada");
    });
  
    it("deve retornar 404 se a tarefa não existir", async () => {
      const response = await request(app)
        .put('/api/tarefa/nao-existe')//id invalido
        .send({
          nome: "Tarefa Inexistente",
        });
  
      expect(response.status).toBe(404);
    });

    it("não deve atualizar uma tarefa com nome vazio", async () => {
        const response = await request(app).put(`/api/tarefa/${tarefaId}`).send({
          nome: "", // Passando uma string vazia
        });
    
        expect(response.status).toBe(400);
      });
  });

  describe("PUT /api/tarefa/:id", () => {
    it("deve atualizar uma tarefa com sucesso", async () => {
      const response = await request(app)
        .put(`/api/tarefa/${tarefaId}`)
        .send({
          nome: "Tarefa Atualizada",
        });
  
      expect(response.status).toBe(200);
    });
  
    it("deve retornar 404 se a tarefa não existir", async () => {
      const response = await request(app)
        .put('/api/tarefa/nao-existe')
        .send({
          nome: "Tarefa Inexistente",
        });
  
      expect(response.status).toBe(404);
    });
  });

  //esse teste ira falhar se a tarefa tiver uma atividade associada por conta do middleware
  describe("DELETE /api/tarefa/:id", () => {
    it("deve deletar uma tarefa com sucesso", async () => {
      const response = await request(app).delete(`/api/tarefa/${tarefaId}`);
      expect(response.status).toBe(204);
    });

    it("deve retornar 404 se a tarefa não existir", async () => {
      const response = await request(app).delete('/api/tarefa/nao-existe'); //id invalido nao existente
      expect(response.status).toBe(404);
    });
  });

});
