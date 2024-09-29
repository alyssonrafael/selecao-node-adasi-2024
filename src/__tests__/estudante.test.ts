import request from "supertest";
import app from "../index";
import prisma from "../prismaClient";

let cursoId: string;

afterAll(async () => {
  // Limpar os dados após os testes
  await prisma.estudante.deleteMany({});
  await prisma.curso.deleteMany({});
});

describe("Estudantes", () => {
  beforeAll(async () => {
    const novoCurso = {
      nome: "Curso de Teste",
    };

    const response = await request(app).post("/api/cursos").send(novoCurso);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    // Captura o ID do curso criado
    cursoId = response.body.id;
  });

  describe("POST /api/estudante", () => {
    it("deve criar um estudante com sucesso", async () => {
      const response = await request(app).post("/api/estudante").send({
        cpf: "123456789",
        nome: "rafael",
        matricula: "987654321",
        cursoId, // Usando o curso criado
      });

      // Verifica o status da resposta e se o corpo contém um ID
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("cpf"); // Verifica se o estudante criado possui um ID
    });

    it("não deve permitir a criação de um estudante com CPF já existente", async () => {
      const response = await request(app).post("/api/estudante").send({
        cpf: "123456789", // Mesmo CPF
        nome: "Outro Nome",
        matricula: "987654322", // Matrícula diferente
        cursoId,
      });

      expect(response.status).toBe(400);
    });

    it("não deve permitir a criação de um estudante com matricula já existente", async () => {
      const response = await request(app).post("/api/estudante").send({
        cpf: "123456789009", //cpf diferente
        nome: "Outro Nome",
        matricula: "987654321", // Matrícula igual
        cursoId,
      });

      expect(response.status).toBe(400);
    });

    it("não deve permitir a criação de um estudante com campos vazios", async () => {
      const response = await request(app).post("/api/estudante").send({
        cpf: "", // CPF vazio
        nome: "", // Nome vazio
        matricula: "", // Matrícula vazia
        cursoId: "", // cursoId vazio
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/estudantes", () => {
    it("deve retornar uma lista de estudantes", async () => {
      // Primeiro, cria um estudante para garantir que haja dados
      await request(app).post("/api/estudante").send({
        cpf: "12345678901",
        nome: "Estudante Teste",
        matricula: "111111111",
        cursoId,
      });

      const response = await request(app).get("/api/estudantes");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true); // Verifica se a resposta é um array
      expect(response.body.length).toBeGreaterThan(0); // Verifica se há pelo menos um estudante
      expect(response.body[0]).toHaveProperty("cpf"); // Verifica se a propriedade cpf está presente
      expect(response.body[0]).toHaveProperty("nome"); // Verifica se a propriedade nome está presente
    });
  });

  describe("GET /api/estudante/:id", () => {
    let estudanteCpf: string;

    beforeAll(async () => {
      const response = await request(app).post("/api/estudante").send({
        cpf: "12345678902",
        nome: "Estudante Único",
        matricula: "222222222",
        cursoId,
      });
      estudanteCpf = response.body.cpf; // Captura o ID do estudante criado
    });

    it("deve retornar um estudante pelo ID", async () => {
      const response = await request(app).get(`/api/estudante/${estudanteCpf}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("cpf", estudanteCpf); // Verifica se o ID é o correto
      expect(response.body).toHaveProperty("cpf"); // Verifica se a propriedade cpf está presente
      expect(response.body).toHaveProperty("nome"); // Verifica se a propriedade nome está presente
    });

    it("deve retornar 404 para um estudante inexistente", async () => {
      const response = await request(app).get(`/api/estudante/invalid-cpf`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/estudante/:id", () => {
    let estudanteCpf: string;

    beforeAll(async () => {
      const response = await request(app).post("/api/estudante").send({
        cpf: "12345678",
        nome: "Estudante Original",
        matricula: "111",
        cursoId,
      });
      estudanteCpf = response.body.cpf; // Captura o CPF do estudante criado como ID
    });

    it("deve atualizar um estudante com sucesso", async () => {
      const response = await request(app)
        .put(`/api/estudante/${estudanteCpf}`)
        .send({
          nome: "rafael1",
          cursoId: cursoId,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("cpf", estudanteCpf); // Verifica se o CPF é o correto
      expect(response.body).toHaveProperty("nome", "rafael1"); // Verifica se o nome foi atualizado
    });

    it("deve retornar 404 para um estudante inexistente", async () => {
      const response = await request(app).put(`/api/estudante/123`).send({
        nome: "rafael2",
        cursoId: cursoId,
      });

      expect(response.status).toBe(404);
    });
  });

 // o teste ira falhar se o estudadnte tiver atividades associadas por conta do middleware 
  describe("DELETE /api/estudante/:cpf", () => {
    it("deve deletar um estudante com sucesso", async () => {
      const cpf = "123456789"; 
      const response = await request(app).delete(`/api/estudante/${cpf}`);
  
      expect(response.status).toBe(204); // Verifica se o status é 204 No Content
    });
  
    it("deve retornar 404 se o estudante não existir", async () => {
      const cpfInexistente = "00000000000"; // CPF que não existe
      const response = await request(app).delete(`/api/estudante/${cpfInexistente}`);
  
      expect(response.status).toBe(404);
    });
  });
});
